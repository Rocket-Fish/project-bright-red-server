import socketIo from "socket.io";
import Server from "@ioc:Adonis/Core/Server";

class Ws {
  public isReady = false;
  public io: socketIo.Server;

  public start(callback: (socket: socketIo.Socket) => void) {
    this.io = socketIo(Server.instance!, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.io.on("connection", callback);
    this.isReady = true;
  }
}

/**
 * This makes our service a singleton
 */
export default new Ws();
