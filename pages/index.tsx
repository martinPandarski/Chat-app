import React, { useEffect, useRef, useState } from "react";
import SocketIOClient from "socket.io-client";
import tw from "twin.macro";

interface IMessage {
  user: string;
  message: string;
}

const currentUser = "User_" + String(new Date().getTime()).substring(-3);

export default function Index() {
  const inputRef = useRef(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [chat, setChat] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect((): any => {
    const socket = SocketIOClient(process.env.NEXT_PUBLIC_API_URL, {
      path: "/api/socketio",
    });

    socket.on("connect", () => {
      console.log("connected", socket.id);
      setIsConnected(true);
    });

    socket.on("message", (message: IMessage) => {
      setChat((chat) => [...chat, message]);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  const sendMessage = async () => {
    if (message) {
      const messageToSend = {
        user: currentUser,
        message,
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageToSend),
      });
    }
  };

  return <div>{process.env.NEXT_PUBLIC_API_URL}</div>;
}
