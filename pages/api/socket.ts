import { Server } from "Socket.IO";

export default function SocketHandler(_, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("send-message", (msg) => {
        console.log(msg);
        socket.broadcast.emit("update-messages", msg);
      });
    });
  }
  res.end();
}
