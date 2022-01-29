import { NextApiRequest } from "next";
import { NextResponseServerIO } from "../../types/next";

export default (req: NextApiRequest, res: NextResponseServerIO) => {
  if (req.method === "POST") {
    const message = req.body;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("message", message);

    res.status(201).json(message);
  }
};
