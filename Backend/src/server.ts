import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let users: Map<WebSocket, string> = new Map();
wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    // @ts-ignore
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type == "join") {
      users.set(socket, parsedMessage.payload.roomId);
    }
    if (parsedMessage.type == "message") {
      const room = users.get(socket);
      for (let [userSocket, roomId] of users) {
        if (roomId == room) {
          userSocket.send(parsedMessage.payload.message);
        }
      }
    }
  });
});
