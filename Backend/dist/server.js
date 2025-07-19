"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let users = new Map();
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
