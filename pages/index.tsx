import React, { useEffect, useRef, useState } from "react";
import SocketIOClient from "socket.io-client";
import { AppBar, Button, Paper, TextField } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

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

      if (response.ok) {
        setMessage("");
      }
    }
    inputRef?.current?.focus();
  };

  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        // width: "100vh",
        justifyContent: "space-between",
      }}
    >
      <AppBar
        position="sticky"
        style={{
          height: "100px",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        Chat
      </AppBar>
      <div
        className="chat-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "auto",
        }}
      >
        {chat.length ? (
          <AnimatePresence initial={false}>
            {chat.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <span
                  style={
                    message?.user === currentUser
                      ? { color: "red" }
                      : { color: "black" }
                  }
                >
                  {message?.user === currentUser ? "Me" : message?.user}
                </span>
                : {message?.message}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p>no Messages</p>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          ref={inputRef}
          type="text"
          value={message}
          placeholder={isConnected ? "Напиши нещо бре" : "Connecting..."}
          disabled={!isConnected}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button
          variant={"outlined"}
          onClick={sendMessage}
          disabled={!isConnected}
        >
          Цък
        </Button>
      </div>
    </Paper>
  );
}
