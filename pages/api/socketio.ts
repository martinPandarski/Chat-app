import { NextApiRequest } from "next";
import { NextResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer: NetServer = res.socket.server as any;
    console.log(httpServer);
    const io = new ServerIO(httpServer, {
      cors: {
        origin: "*",
      },
      path: "/api/socketio",
    });
    console.log(io);

    res.socket.server.io = io;
    console.log("op");
  }
  res.end();
};
