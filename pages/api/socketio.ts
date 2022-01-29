import { NextApiRequest } from "next";
import { NextResponseServerIO } from "../../types/next";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("Socket.io server initialized!");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket.io",
    });
    res.socket.server.io = io;
  }
  res.end();
};
