class Observer {
  static #_CONNECTION = "connection";
  static #_USER_JOINED = "userJoined";
  static #_DISCONNECT = "disconnect";
  static #_ADD_LOG = "addLog";
  static #_ADD_SHOPPING_ITEM = "addShoppingItem";
  static #_HAS_SHOPPING_LIST_UPDATE = "hasShoppingListUpdate";
  static #_HAS_BUYING_LIST_UPDATE = "hasBuyingListUpdate";
  static #_HAS_DONE_LIST_UPDATE = "hasDoneListUpdate";
  static #_EDIT_ITEM = "editItem";
  static #_ITEM_ASSIGNED_TO_USER = "itemAssignedToUser";
  static #_DELETE_ITEM = "deleteItem";
  static #_HAS_ITEM_TYPE_CHANGE = "hasItemTypeChange";

  static get CONNECTION() {
    return this.#_CONNECTION;
  }
  static get USER_JOINED() {
    return this.#_USER_JOINED;
  }
  static get DISCONNECT() {
    return this.#_DISCONNECT;
  }
  static get ADD_LOG() {
    return this.#_ADD_LOG;
  }
  static get ADD_SHOPPING_ITEM() {
    return this.#_ADD_SHOPPING_ITEM;
  }
  static get HAS_ITEM_TYPE_CHANGE() {
    return this.#_HAS_ITEM_TYPE_CHANGE;
  }
  static get HAS_SHOPPING_LIST_UPDATE() {
    return this.#_HAS_SHOPPING_LIST_UPDATE;
  }
  static get HAS_BUYING_LIST_UPDATE() {
    return this.#_HAS_BUYING_LIST_UPDATE;
  }
  static get HAS_DONE_LIST_UPDATE() {
    return this.#_HAS_DONE_LIST_UPDATE;
  }
  static get EDIT_ITEM() {
    return this.#_EDIT_ITEM;
  }
  static get ITEM_ASSIGNED_TO_USER() {
    return this.#_ITEM_ASSIGNED_TO_USER;
  }
  static get DELETE_ITEM() {
    return this.#_DELETE_ITEM;
  }
}

class Emitter {
  static #_ALERT = "alert";
  static #_UPDATE_USER_LIST = "updateUserList";
  static #_UPDATE_SHOPPING_LIST = "updateShoppingList";
  static #_UPDATE_BUYING_LIST = "updateBuyingList";
  static #_UPDATE_DONE_LIST = "updateDoneList";
  static #_UPDATE_LOGS = "updatelogs";
  static #_USER_JOIN_SUCCESS = "userJoinSuccess";

  static get ALERT() {
    return this.#_ALERT;
  }
  static get UPDATE_USER_LIST() {
    return this.#_UPDATE_USER_LIST;
  }
  static get UPDATE_SHOPPING_LIST() {
    return this.#_UPDATE_SHOPPING_LIST;
  }
  static get UPDATE_BUYING_LIST() {
    return this.#_UPDATE_BUYING_LIST;
  }
  static get UPDATE_DONE_LIST() {
    return this.#_UPDATE_DONE_LIST;
  }
  static get UPDATE_LOGS() {
    return this.#_UPDATE_LOGS;
  }

  static get USER_JOIN_SUCCESS() {
    return this.#_USER_JOIN_SUCCESS;
  }
}

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
