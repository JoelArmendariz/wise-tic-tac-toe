import prisma from '@/prisma/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return PostHandler(req, res);
  return res.status(405).send('Method not allowed');
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId, board } = req.body as {
    gameId: string;
    board: string;
  };

  try {
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
      },
    });

    if (game) {
      const nextPlayerId = game.playerIDs.find(playerId => playerId !== game.currentPlayerID);
      const updatedGame = await prisma.game.update({
        where: {
          id: gameId,
        },
        data: {
          board,
          currentPlayerID: nextPlayerId,
        },
      });
      return res.send(updatedGame);
    }

    return res.status(200).send(game);
  } catch (e) {
    return res.status(500).send(`Could not make game move: ${e}`);
  }
}
