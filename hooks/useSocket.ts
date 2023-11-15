import io, { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

export default function useSocket() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    let socketToDisconnect: Socket;
    fetch('/api/socket').then(() => {
      const socketIO = io();
      setSocket(socketIO);
      socketToDisconnect = socketIO;
      socketIO.on('connect', () => {
        console.log('connected!');
      });
    });

    return () => {
      socketToDisconnect?.disconnect?.();
    };
  }, []);

  return socket;
}
