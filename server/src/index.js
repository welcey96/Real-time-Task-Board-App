const { connectDB, getCollection } = require("./db/mongo");

(async () => {
  await connectDB();
})();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Observer, Emitter } = require("./Enum.js");
const { getRandomColor, getInitials } = require("./utils.js");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

let activeUsers = [];
let shoppingList = [];
let buyingList = [];
let doneList = [];
let users = [];

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on(Observer.CONNECTION, (socket) => {
  socket.on(Observer.USER_JOINED, async (data) => {
    onUserJoined(socket, data);
    await onInit();
  });

  socket.on(Observer.ADD_LOG, (msg) => onAddLog(socket.data.id, msg));

  socket.on(Observer.ADD_SHOPPING_ITEM, (data) =>
    onAddShoppingItem(socket.data.id, data)
  );
  socket.on(Observer.HAS_ITEM_TYPE_CHANGE, (data) => onHasItemTypeChange(data));
  socket.on(Observer.HAS_SHOPPING_LIST_UPDATE, (data) =>
    onHasShoppingListUpdate(socket.data.id, data)
  );
  socket.on(Observer.HAS_BUYING_LIST_UPDATE, (data) =>
    onHasBuyingListUpdate(socket.data.id, data)
  );
  socket.on(Observer.HAS_DONE_LIST_UPDATE, (data) =>
    onHasDoneListUpdate(socket.data.id, data)
  );
  socket.on(Observer.EDIT_ITEM, (data) =>
    onHasItemEdited(socket.data.id, data)
  );

  socket.on(Observer.ITEM_ASSIGNED_TO_USER, (data) =>
    onAssignItemToUser(socket.data.id, data)
  );

  socket.on(Observer.DELETE_ITEM, (data) => onDeleteItem(socket.data.id, data));

  socket.on(Observer.DISCONNECT, () => onDisconnect(socket.data.id));
});

async function onInit() {
  shoppingList.length = 0;
  buyingList.length = 0;
  doneList.length = 0;

  const allUsers = await getCollection("users")
    .find({}, { projection: { _id: 0 } })
    .toArray();
  if (!!users.length) {
    users = allUsers;
  }

  const items = await getCollection("items")
    .find({}, { projection: { _id: 0 } })
    .toArray();

  if (!!items.length) {
    for (const i of items) {
      const item = {
        ...i,
        assignedUser: allUsers.find((u) => u.id === i.assignedUser) ?? null,
      };
      if (item.type === 1) shoppingList.push(item);
      else if (item.type === 2) buyingList.push(item);
      else doneList.push(item);
    }
  }

  notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
  notify(Emitter.UPDATE_BUYING_LIST, buyingList);
  notify(Emitter.UPDATE_DONE_LIST, doneList);
}

async function onUserJoined(socket, data) {
  const usersCollection = getCollection("users");

  let user;

  const account = await usersCollection.findOne({
    username: data.username,
  });

  if (!account) {
    user = {
      id: crypto.randomUUID(),
      ...data,
      initials: getInitials(data.username),
      color: getRandomColor(),
      date: new Date(),
    };

    if (await usersCollection.insertOne(user)) {
      emit(socket, Emitter.ALERT, {
        data: `👐 Welcome ${data.username}!`,
        status: 1,
      });
    }
  } else {
    user = account;
  }

  const activeUser = {
    ...user,
    socketId: socket.id,
  };

  socket.data.id = user.id;

  if (!activeUsers.find((u) => u.id === user.id)) {
    activeUsers.push(activeUser);
  }

  const { _id, ...rest } = user;

  onAddLog(user.id, `🙋 joined the session`);
  emit(socket, Emitter.USER_JOIN_SUCCESS, rest);
  notify(Emitter.UPDATE_USER_LIST, activeUsers);
}

async function onAddShoppingItem(id, data) {
  const item = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    type: 1,
  };

  const itemsCollection = getCollection("items");
  if (!!(await itemsCollection.insertOne(item))) {
    shoppingList.push(item);
    notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
    onAddLog(id, `👀 added task '${data.name}' to the board`);
  }
}

async function onHasItemTypeChange(data) {
  const { id, type } = data;
  const itemsCollection = getCollection("items");
  await itemsCollection.updateOne({ id: id }, { $set: { type: type } });
}

function onHasShoppingListUpdate(id, data) {
  shoppingList = data;
  shoppingList.forEach((item) => {
    if (item.type !== 1) item.type = 1;
  });
  notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
}

function onHasBuyingListUpdate(id, data) {
  buyingList = data;
  buyingList.forEach((item) => {
    if (item.type !== 2) item.type = 2;
  });
  notify(Emitter.UPDATE_BUYING_LIST, buyingList);
}

function onHasDoneListUpdate(id, data) {
  doneList = data;
  doneList.forEach((item) => {
    if (item.type !== 3) item.type = 3;
  });
  notify(Emitter.UPDATE_DONE_LIST, doneList);
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

async function onHasItemEdited(userId, data) {
  const { id, name, type } = data;

  const itemsCollection = getCollection("items");
  const res = await itemsCollection.updateOne(
    { id: id },
    { $set: { name: name } }
  );
  if (res.modifiedCount > 0) {
    const list = getListByType(type);

    if (list.length) {
      const item = list.find((x) => x.id == id);

      if (item) {
        const prev = item.name;
        item.name = name;

        notifyListByType(type);
        onAddLog(userId, `updated task name '${prev}' to '${name}'`);
      }
    }
  }
}

async function onAssignItemToUser(userId, data) {
  const { id, type, assignedUser } = data;

  const itemsCollection = getCollection("items");
  const res = await itemsCollection.updateOne(
    { id: id },
    { $set: { assignedUser: assignedUser?.id } }
  );

  if (res.modifiedCount > 0) {
    const list = getListByType(type);
    if (list.length) {
      const item = list.find((x) => x.id == id);

      if (item) {
        item.assignedUser = assignedUser;

        let msg = "";
        if (assignedUser)
          msg = `assigned task '${item.name}' to user ${
            getUserById(assignedUser?.id)?.username
          }`;
        else msg = `set task '${item.name}' as unassigned`;

        notifyListByType(type);
        onAddLog(userId, msg);
      }
    }
  }
}

async function onDeleteItem(socketId, data) {
  const itemsCollection = getCollection("items");
  const doc = await itemsCollection.findOne({ id: data.id });

  if (doc) {
    const result = await itemsCollection.deleteOne({ id: data.id });
    const { id, type } = data;
    if (result.deletedCount > 0) {
      if (type === "shoppingList")
        shoppingList = shoppingList.filter((i) => i.id != id);
      else if (type === "buyingList")
        buyingList = buyingList.filter((i) => i.id != id);
      else doneList = doneList.filter((i) => i.id != id);

      notifyListByType(data.type);
      onAddLog(socketId, `deleted task '${doc.name}' from the board`);
    }
  }
}

function onDisconnect(id) {
  if (getUserById(id)) {
    onAddLog(id, `left the session 👋`);
  }

  activeUsers = activeUsers.filter((u) => u.id != id);
  notify(Emitter.UPDATE_USER_LIST, activeUsers);
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

async function notifyListByType(type) {
  if (type === "shoppingList")
    notify(Emitter.UPDATE_SHOPPING_LIST, shoppingList);
  else if (type === "buyingList")
    notify(Emitter.UPDATE_BUYING_LIST, buyingList);
  else notify(Emitter.UPDATE_DONE_LIST, doneList);
}

function getUsernameById(id) {
  return activeUsers.find((u) => u.id == id)?.username ?? "";
}

function getUserById(id) {
  return activeUsers.find((u) => u.id == id);
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

server.listen(PORT, () => {
  console.warn(`Server running on http://localhost:${PORT}`);
});
