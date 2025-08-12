# 🛒 Shopping List App


A simple shopping list app powered by WebSockets, add items, drag-and-drop interaction, and a UI built in Angular.


## Tech Stack
[![Node.js](https://img.shields.io/badge/Node.js-v20.17.0-blue?logo=nodedotjs&logoColor=white&style=flat&label=Node.js&message=LTS)](https://nodejs.org/en/download) [![Angular](https://img.shields.io/badge/Angular-v19-red?logo=angular&logoColor=white)](https://angular.dev/) [![Socket.IO](https://img.shields.io/badge/Socket.io-4.x-black?logo=socket.io&logoColor=white)](https://socket.io/) [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)


### 🧩 Client
- Angular
- Bootstrap 5
- SCSS
- [ngx-drag-drop](https://www.npmjs.com/package/@swimlane/ngx-drag-drop)
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr)
- socket.io-client

### ⚙️ Server
- Node.js
- Express
- Socket.IO


## Installation
✨ If server runs on port 3000, make sure the client points to that ✨

Clone the project
```bash
  git clone https://github.com/welcey96/websockets-shoppingList
```

Go to the project directory

```bash
  cd websockets
```

Install dependencies on client and server

```bash
  cd server
  npm install
```

```bash
  cd client
  npm install
```

Start server

```bash
  ...websockets > cd server
  ...websockets\server > npm run dev 
```

Start client

```bash
  ...websockets > cd client
  ...websockets\client > npm run start 
```

On the same client terminal after running npm run start, scroll through the bottom of the terminal and select the url where the app is served.
One url is using localhost:port, and the other one is the ipAddress:port (click the second one to let others connect to your app) 

