import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import GameCodeForm from "@/components/GameCodeForm";

export default function Home() {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/socket").then(() => {
      const socketIO = io();
      setSocket(socketIO);
      socketIO.on("connect", () => {
        console.log("connected!");
      });

      socketIO.on("update-messages", (msg) => {
        setMessage(msg);
      });
    });
  }, []);

  const sendMessage = () => socket?.emit("send-message", "NEW MESSAGE!");

  return (
    <main className="flex flex-col h-screen items-center">
      <GameCodeForm />
    </main>
  );
}
