const Observer = Object.freeze({
  CONNECTION: "connection",
  USER_JOINED: "userJoined",
  DISCONNECT: "disconnect",
  ADD_LOG: "addLog",
  ADD_SHOPPING_ITEM: "addShoppingItem",
  HAS_SHOPPING_LIST_UPDATE: "hasShoppingListUpdate",
  HAS_BUYING_LIST_UPDATE: "hasBuyingListUpdate",
  HAS_DONE_LIST_UPDATE: "hasDoneListUpdate",
  EDIT_ITEM: "editItem",
  ITEM_ASSIGNED_TO_USER: "itemAssignedToUser",
  DELETE_ITEM: "deleteItem",
  HAS_ITEM_TYPE_CHANGE: "hasItemTypeChange",
});

const Emitter = Object.freeze({
  ALERT: "alert",
  UPDATE_USER_LIST: "updateUserList",
  UPDATE_SHOPPING_LIST: "updateShoppingList",
  UPDATE_BUYING_LIST: "updateBuyingList",
  UPDATE_DONE_LIST: "updateDoneList",
  UPDATE_LOGS: "updateLogs",
  USER_JOIN_SUCCESS: "userJoinSuccess",
});

const ItemType = {
  shoppingList: 1,
  buyingList: 2,
  doneList: 3,
  1: "shoppingList",
  2: "buyingList",
  3: "doneList",
};

module.exports = {
  Observer,
  Emitter,
  ItemType,
};
