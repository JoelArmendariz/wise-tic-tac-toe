import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: Server | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function SocketHandler(_: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('player-enter', ({ gameId, playerId }) => {
        socket.broadcast.emit('new-player', { gameId, playerId });
      });
      socket.on('player-move', ({ boardString, gameId }) => {
        socket.broadcast.emit('update-board', { boardString, gameId });
      });
      socket.on('player-wins', ({ player, gameId }) => {
        socket.broadcast.emit('update-winner', { player, gameId });
      });
      socket.on('tie-game', (gameId: string) => {
        socket.broadcast.emit('update-tie', gameId);
      });
      socket.on('restart-game', ({ playerId, playerName, gameId, newGameId }) => {
        socket.broadcast.emit('prompt-restart', { playerId, playerName, gameId, newGameId });
      });
    });
  }
  res.end();
}
