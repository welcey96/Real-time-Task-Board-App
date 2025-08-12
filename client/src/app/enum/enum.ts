export enum SocketEvent {
  UpdateLogs = 'updatelogs',
  UpdateUserList = 'updateUserList',
  UpdateShoppingList = 'updateShoppingList',
  UpdateBuyingList = 'updateBuyingList',
  UpdateDoneList = 'updateDoneList',
  Alert = 'alert',
}

export enum SocketEmitEvent {
  HasShoppingListUpdate = 'hasShoppingListUpdate',
  HasBuyingListUpdate = 'hasBuyingListUpdate',
  HasDoneListUpdate = 'hasDoneListUpdate',
  AddShoppingItem = 'addShoppingItem',
  AddLog = 'addLog',
  UserJoined = 'userJoined',
  EditItem = 'editItem',
  ItemAssignedToUser = 'itemAssignedToUser',
  DeleteItem = 'deleteItem'
}

export enum ListType {
  ShoppingList = 'shoppingList',
  BuyingList = 'buyingList',
  DoneList = 'doneList',
}
