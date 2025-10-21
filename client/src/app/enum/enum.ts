export enum SocketEvent {
  UpdateLogs = 'updateLogs',
  UpdateUserList = 'updateUserList',
  UpdateShoppingList = 'updateShoppingList',
  UpdateBuyingList = 'updateBuyingList',
  UpdateDoneList = 'updateDoneList',
  Alert = 'alert',
  UserJoinSuccess = 'userJoinSuccess',
}

export enum SocketEmitEvent {
  HasItemTypeChange = 'hasItemTypeChange',
  HasShoppingListUpdate = 'hasShoppingListUpdate',
  HasBuyingListUpdate = 'hasBuyingListUpdate',
  HasDoneListUpdate = 'hasDoneListUpdate',
  AddShoppingItem = 'addShoppingItem',
  AddLog = 'addLog',
  UserJoined = 'userJoined',
  EditItem = 'editItem',
  ItemAssignedToUser = 'itemAssignedToUser',
  DeleteItem = 'deleteItem',
}

export enum ListType {
  ShoppingList = 'shoppingList',
  BuyingList = 'buyingList',
  DoneList = 'doneList',
}

export const ListTypeIndex = {
  [ListType.ShoppingList]: 1,
  [ListType.BuyingList]: 2,
  [ListType.DoneList]: 3,
};
