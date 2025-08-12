import { NgFor, NgIf, NgStyle, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { UserModel } from '@models/models';
import { users$ } from '@models/signals';
import { slideInAnimation } from '@shared/animations/animations';

@Component({
  selector: 'app-user-list',
  imports: [NgIf, NgFor, NgStyle, UpperCasePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  animations: [slideInAnimation],
})
export class UserListComponent {
  isCollapsed: boolean = false;

  get users() {
    return users$();
  }

  trackById(index: number, user: UserModel) {
    return user.id;
  }
}
