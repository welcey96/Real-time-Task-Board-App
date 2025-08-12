import {
  AfterViewChecked,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SocketService } from '@services/socket.service';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DndDropEvent, DndModule, DropEffect } from 'ngx-drag-drop';
import {
  AlertResponse,
  DropzoneLayout,
  IShoppingItem,
  ShoppingItem,
  UserModel,
} from '@models/models';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { ListType, SocketEmitEvent, SocketEvent } from '@enum/enum';
import { TopbarComponent } from '@shared/components/top-bar/top-bar.component';
import { UserListComponent } from '@shared/components/user-list/user-list.component';
import { LogListComponent } from '@shared/components/log-list/log-list.component';
import { users$ } from '@models/signals';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DndModule,
    TopbarComponent,
    NgClass,
    UserListComponent,
    LogListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewChecked {
  @ViewChild('shoppingItemInput') shoppingItemInput?: ElementRef;
  @ViewChild('editItemInput') editItemInput?: ElementRef;
  @ViewChild('cardElement') cardElement?: ElementRef;
  @ViewChild('usersDropdown') usersDropdown?: ElementRef;

  private destroy$ = new Subject<void>();

  shoppingItem = '';
  toEditItem = new ShoppingItem();
  selectedTaskId = '';

  createItemToggle = false;
  editMode = false;
  assignMode = false;

  layout: DropzoneLayout = {
    container: 'row',
    list: 'column',
    dndHorizontal: false,
  };

  ListType = ListType;
  shoppingList: IShoppingItem[] = [];
  buyingList: IShoppingItem[] = [];
  doneList: IShoppingItem[] = [];
  mergedList: IShoppingItem[] = [];

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  get users() {
    return users$();
  }

  getLogInId() {
    return this.socketService.getSocketId();
  }

  ngOnInit() {
    this.socketService.emit(SocketEmitEvent.UserJoined, {
      username: this.userService.getUsername(),
    });

    this.listen<AlertResponse>(SocketEvent.Alert, (res) => {
      if (res.status == 1) this.toastr.success(res.data);
      else if (res.status == 2) this.toastr.warning(res.data);
      else this.toastr.info(res.data);
    });

    this.listen<IShoppingItem[]>(SocketEvent.UpdateShoppingList, (res) => {
      this.shoppingList = res;
      this.mergeAllList();
    });

    this.listen<IShoppingItem[]>(SocketEvent.UpdateBuyingList, (res) => {
      this.buyingList = res;
      this.mergeAllList();
    });

    this.listen<IShoppingItem[]>(SocketEvent.UpdateDoneList, (res) => {
      this.doneList = res;
      this.mergeAllList();
    });
  }

  ngAfterViewChecked() {
    if (this.createItemToggle && this.shoppingItemInput) {
      this.renderer
        .selectRootElement(this.shoppingItemInput.nativeElement)
        .focus();
    } else if (this.editMode && this.editItemInput) {
      this.renderer.selectRootElement(this.editItemInput.nativeElement).focus();
    }

    fromEvent(document, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (
          this.createItemToggle &&
          this.cardElement &&
          !this.cardElement.nativeElement.contains(event.target)
        ) {
          this.createItemToggle = false;
        }

        if (
          this.assignMode &&
          this.usersDropdown &&
          !this.usersDropdown.nativeElement.contains(event.target)
        ) {
          this.assignMode = false;
          this.selectedTaskId = '';
        }
      });
  }

  addItem(): void {
    if (this.shoppingItem.trim()) {
      if (
        !this.mergedList.find(
          (i) =>
            i.name.toLowerCase().trim() ===
            this.shoppingItem.toLowerCase().trim()
        )
      ) {
        this.socketService.emit(
          SocketEmitEvent.AddShoppingItem,
          new ShoppingItem(this.shoppingItem)
        );

        this.toggleCreate();
      } else {
        this.toastr.error('Item already added');
      }
    }
  }

  toggleCreate() {
    this.editMode = false;
    this.createItemToggle = !this.createItemToggle;
    if (!this.createItemToggle) this.shoppingItem = '';
  }

  toggleEdit(item: ShoppingItem) {
    this.createItemToggle = false;
    this.editMode = true;
    this.toEditItem = new ShoppingItem(item.name, item.id);
  }

  onResetEdit() {
    this.toEditItem = new ShoppingItem();
    this.editMode = false;
  }

  onEdit(type: ListType, item: IShoppingItem) {
    if (item.assignedUser && this.getLogInId() != item.assignedUser.id) {
      this.toastr.error(`User not allowed to update item`, 'Update Denied');
      return;
    }

    const { id, name } = this.toEditItem;
    if (name.trim()) {
      const item = this.mergedList.find((i) => i.id == this.toEditItem.id);

      if (!item) {
        this.toastr.error(
          `The item '${this.toEditItem.name}' was already deleted`,
          'Error'
        );
      } else {
        if (name.trim() != item.name.trim())
          this.socketService.emit(SocketEmitEvent.EditItem, {
            id,
            name,
            type,
          });
      }
    }

    this.onResetEdit();
  }

  toggleUserDropdown(id: string, type: ListType) {
    if (type == ListType.DoneList) return;
    this.assignMode = true;
    this.selectedTaskId = id;
  }

  onAssignUser(item: IShoppingItem, user: UserModel | null, type: ListType) {
    if (
      (!user && !item.assignedUser) ||
      (user && item.assignedUser && user.id == item.assignedUser.id)
    ) {
      this.assignMode = false;
      this.selectedTaskId = '';
      return;
    }

    if (user) {
      if (!this.users.find((x) => x.id == user.id)) {
        this.toastr.error(
          `User with username '${user}' has disconnected`,
          'Item Assignment Error'
        );
        this.assignMode = false;
        this.selectedTaskId = '';
        return;
      }
    }

    this.socketService.emit(SocketEmitEvent.ItemAssignedToUser, {
      ...item,
      assignedUser: user,
      type,
    });

    this.assignMode = false;
    this.selectedTaskId = '';
  }

  onDeleteItem(item: IShoppingItem, type: ListType) {
    if (item && item.id.length) {
      if (!this.mergedList.find((i) => i.id == item.id)) {
        this.toastr.error(
          `The item '${this.toEditItem.name}' was already deleted`,
          'Error'
        );
        return;
      }

      this.socketService.emit(SocketEmitEvent.DeleteItem, {
        id: item.id,
        type,
      });
    }
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === 'move') {
      list.splice(list.indexOf(item), 1);

      this.socketService.emit(
        SocketEmitEvent.HasShoppingListUpdate,
        this.shoppingList
      );
      this.socketService.emit(
        SocketEmitEvent.HasBuyingListUpdate,
        this.buyingList
      );
      this.socketService.emit(SocketEmitEvent.HasDoneListUpdate, this.doneList);
    }
  }

  onDrop(event: DndDropEvent, type: ListType, list?: any[]) {
    if (list && event.dropEffect === 'move') {
      if (type == ListType.DoneList && this.assignMode) {
        this.assignMode = false;
        this.selectedTaskId = '';
      }

      const { data } = event;
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      list.splice(index, 0, data.item);

      if (data.origin !== type) {
        if (type == ListType.ShoppingList)
          this.socketService.emit(
            SocketEmitEvent.AddLog,
            `📜 moved item '${data.item.name}' back to shopping list`
          );
        else if (type == ListType.BuyingList)
          this.socketService.emit(
            SocketEmitEvent.AddLog,
            `❗moved item '${data.item.name}' to buying`
          );
        else if (type == ListType.DoneList)
          this.socketService.emit(
            SocketEmitEvent.AddLog,
            ` ✅ moved item '${data.item.name}' to done`
          );
      }
    }
  }

  private mergeAllList() {
    this.mergedList = [
      ...this.shoppingList,
      ...this.buyingList,
      ...this.doneList,
    ];
  }

  private listen<T>(event: SocketEvent, callback: (res: T) => void) {
    this.socketService
      .on$(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(callback);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
