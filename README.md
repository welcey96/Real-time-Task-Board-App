# 🗂️ Collaborative Task Board

A real-time collaborative task board built with Angular, MSAL authentication, and Socket.IO.
Users can add, assign, edit, delete, and move items using drag-and-drop. Changes are synced instantly across clients and persisted in MongoDB. Only assigned users can modify their items.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-v20.17.0-blue?logo=nodedotjs&logoColor=white&style=flat&label=Node.js&message=LTS)](https://nodejs.org/en/download) [![Angular](https://img.shields.io/badge/Angular-v19-red?logo=angular&logoColor=white)](https://angular.dev/) [![Socket.IO](https://img.shields.io/badge/Socket.io-4.x-black?logo=socket.io&logoColor=white)](https://socket.io/) [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-v7.0-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![MSAL](https://img.shields.io/badge/MSAL-Microsoft-blue?logo=microsoft&logoColor=white)](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview) [![Sass](https://img.shields.io/badge/Sass-v1.70.0-pink?logo=sass&logoColor=white)](https://sass-lang.com/)

### 🧩 Client

- Angular
- MSAL for authentication
- [ngx-drag-drop](https://www.npmjs.com/package/@swimlane/ngx-drag-drop) for drag-and-drop functionality
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr) for notifications
- [socket.io-client](https://www.npmjs.com/package/socket.io-client)
- Sass (SCSS)
- Bootstrap 5

### ⚙️ Server

- Node.js
- Express
- Socket.IO
- MongoDB

## Features

- **Authentication**

  - Login using **MSAL (Microsoft Azure AD)** with redirect flow.
  - Persist login across page refreshes.

- **Real-time Collaboration**

  - Users see updates instantly via **Socket.IO**.
  - Multiple clients synchronize in real-time.

- **Item Management**

  - Add, edit, delete, and update items.
  - Drag-and-drop interaction for task organization.
  - Move items between statuses (ToDo, In Progress, Done).
  - Only assigned users can make changes to their items.

- **Persistence**

  - **MongoDB** stores users and items for persistence.
  - Maintains item state and user assignments across sessions.

- **Client-side State Management**
  - Angular signals manage active user and item states.

## Requirements

Before running the app, make sure you have the following installed and configured:

- **Node.js** (v20.x recommended)
- **Angular CLI** (v19.x)
- **MongoDB**
  - Either local MongoDB or Docker container
  - Ensure the connection string is added to `.env` as `DB`
- **Azure / MSAL Authentication**
  - Register an app in [Microsoft Entra ID](https://entra.microsoft.com/)
  - Obtain **Tenant ID**, **Client ID**, and **Redirect URI**
  - Add these values to `.env` as `authority`, `clientId`, and `REDIRECT_URI`

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

### :memo: ToDos / WIP

- Remove username field on login :heavy_check_mark:
- Add logout feature :heavy_check_mark:
- Implement Authentication :heavy_check_mark:
- Keep the sort order of the cards (on refresh) :hammer_and_wrench:
- Improve UI :construction:
- Track all users (offline and online) :heavy_check_mark:
- Can assign task to any user (offline/online) :heavy_check_mark:
- Persist logs :hammer_and_wrench:
