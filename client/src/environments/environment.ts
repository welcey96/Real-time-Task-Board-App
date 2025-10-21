export const environment = {
  "production": false,
  "msalConfig": {
    "auth": {
      "clientId": "fde396f7-6f15-4b7a-9e12-cdbd5439ac1b",
      "authority": "https://login.microsoftonline.com/common"
    }
  },
  "apiConfig": {
    "scopes": [
      "user.read"
    ],
    "uri": "https://graph.microsoft.com/v1.0/me"
  },
  "socketUrl": "ws://localhost:3000"
};