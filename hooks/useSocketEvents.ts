import { useEffect } from 'react';
import useSocket from './useSocket';

type SocketEvents = Record<string, (...args: any[]) => void>;

export default function useSocketEvents(events?: SocketEvents) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !events) return;
    for (const event in events) {
      socket.removeListener(event);
      socket.on(event, events[event]);
    }
  }, [events, socket]);

  return socket;
}
