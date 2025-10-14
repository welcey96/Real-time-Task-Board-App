require("./db/mongo.js");
const express = require("express");

const http = require("http");
const { Server } = require("socket.io");
const { Observer, Emitter } = require("./Enum.js");
const { getRandomColor, getInitials } = require("./utils.js");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

let users = [];
let shoppingList = [];
let buyingList = [];
let doneList = [];

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on(Observer.CONNECTION, (socket) => {
  socket.on(Observer.USER_JOINED, (data) => onUserJoined(socket, data));
  socket.on(Observer.ADD_LOG, (msg) => onAddLog(socket.id, msg));

  socket.on(Observer.ADD_SHOPPING_ITEM, (data) =>
    onAddShoppingItem(socket.id, data)
  );
  socket.on(Observer.HAS_SHOPPING_LIST_UPDATE, (data) =>
    onHasShoppingListUpdate(socket.id, data)
  );
  socket.on(Observer.HAS_BUYING_LIST_UPDATE, (data) =>
    onHasBuyingListUpdate(socket.id, data)
  );
  socket.on(Observer.HAS_DONE_LIST_UPDATE, (data) =>
    onHasDoneListUpdate(socket.id, data)
  );
  socket.on(Observer.EDIT_ITEM, (data) => onHasItemEditted(socket.id, data));

  socket.on(Observer.ITEM_ASSIGNED_TO_USER, (data) =>
    onAssignItemToUser(socket.id, data)
  );

  socket.on(Observer.DELETE_ITEM, (data) => onDeleteItem(socket.id, data));

  socket.on(Observer.DISCONNECT, () => onDisconnect(socket.id));
});

function onUserJoined(socket, data) {
  users.push({
    id: socket.id,
    ...data,
    initials: getInitials(data.username),
    color: getRandomColor(),
    date: new Date(),
  });

  onAddLog(socket.id, `🙋 joined the session`);

  emit(socket, Emitter.ALERT, {
    data: `👐 Welcome ${data.username}!`,
    status: 1,
  });

  notify(Emitter.UPDATE_USER_LIST, users);

  //feed current data once logged in
  notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
  notify(Emitter.UPDATE_BUYING_LIST, buyingList);
  notify(Emitter.UPDATE_DONE_LIST, doneList);
}

function onAddShoppingItem(id, data) {
  shoppingList.push({
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  });
  notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
  onAddLog(id, `👀 added item '${data.name}' to the list`);
}

function onHasShoppingListUpdate(id, data) {
  shoppingList = data;
  notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
}

function onHasBuyingListUpdate(id, data) {
  buyingList = data;
  notify(Emitter.UPDATE_BUYING_LIST, buyingList);
}

function onAddLog(id, msg) {
  notify(Emitter.UPDATE_LOGS, {
    id: id,
    userColor: getUserById(id)?.color ?? "#fff",
    username: getUsernameById(id) ?? "",
    message: msg,
    timestamp: new Date(),
  });
}

function onHasDoneListUpdate(id, data) {
  doneList = data;
  notify(Emitter.UPDATE_DONE_LIST, doneList);
}

function onHasItemEditted(socketId, data) {
  const { type, id, name } = data;
  const list = getListByType(type);

  if (list.length) {
    const item = list.find((x) => x.id == id);

    if (item) {
      const prev = item.name;
      item.name = name;
      notifyListByType(type);
      onAddLog(socketId, `updated item '${prev}' to '${name}'`);
    }
  }
}

function onAssignItemToUser(socketId, data) {
  const { id, type, assignedUser } = data;
  const list = getListByType(type);
  if (list.length) {
    const item = list.find((x) => x.id == id);
    if (item) {
      item.assignedUser = assignedUser;

      let msg = "";
      if (assignedUser)
        msg = `assigned item '${item.name}' to user ${
          getUserById(assignedUser.id).username
        }`;
      else msg = `set item '${item.name}' as unassigned`;

      notifyListByType(type);
      onAddLog(socketId, msg);
    }
  }
}

function onDeleteItem(socketId, data) {
  const { id, type } = data;
  const list = getListByType(type);
  if (list.length) {
    const index = list.findIndex((x) => x.id == id);
    if (index > -1) {
      const prev = list[index].name;
      list.splice(index, 1);
      notifyListByType(type);
      onAddLog(socketId, `deleted item '${prev}' from the list`);
    }
  }
}

function onDisconnect(id) {
  if (getUserById(id)) {
    onAddLog(id, `left the session 👋`);
  }

  users = users.filter((u) => u.id != id);
  notify(Emitter.UPDATE_USER_LIST, users);
}

function getListByType(type) {
  return type == "shoppingList"
    ? shoppingList
    : type == "buyingList"
    ? buyingList
    : type == "doneList"
    ? doneList
    : [];
}

function notifyListByType(type) {
  if (type === "shoppingList")
    notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
  else if (type === "buyingList")
    notify(Emitter.UPDATE_BUYING_LIST, buyingList);
  else if (type === "doneList") notify(Emitter.UPDATE_DONE_LIST, doneList);
}

function getUsernameById(id) {
  return users.find((u) => u.id == id)?.username ?? "";
}

function getUserById(id) {
  return users.find((u) => u.id == id);
}

//sender only
function emit(socket, event, data) {
  socket.emit(event, data);
}

//all clients and sender
function notify(event, data) {
  io.emit(event, data);
}

//all clients except sender
function broadcast(socket, event, data) {
  socket.broadcast.emit(event, data);
}

server.listen(PORT, () => {
  console.warn(`Server running on http://localhost:${PORT}`);
});
