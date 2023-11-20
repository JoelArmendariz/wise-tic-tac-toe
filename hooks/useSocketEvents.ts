import { useEffect } from 'react';
import useSocket from './useSocket';

// These args can really be anything given back from the socket event
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
