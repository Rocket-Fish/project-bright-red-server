import Ws from "App/Services/Ws";

Ws.start((socket) => {
  socket.on("join", (room) => {
    socket.join(room);
  });
});
