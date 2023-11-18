import prisma from '@/prisma/prismaClient';
import { GameStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return PostHandler(req, res);
  return res.status(405).send('Method not allowed');
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const { winnerID, gameId } = req.body as { winnerID: string; gameId: string };

  try {
    const game = await prisma.game.findFirst({
      where: { id: gameId },
    });

    if (!game) {
      return res.status(404).send('Game not found');
    }

    // If there is a winner, add the winner to the game and update the player object
    if (winnerID) {
      const winner = await prisma.player.findUnique({
        where: { id: winnerID },
        include: { wins: true },
      });

      const updatedGame = (await prisma.game.update({
        where: { id: gameId },
        data: { winner: { connect: { id: winnerID } }, status: GameStatus.FINISHED },
        include: { winner: true },
      })) as unknown;

      await prisma.player.update({
        where: { id: winnerID },
        data: {
          winCount: (winner?.winCount || 0) + 1,
        },
      });
      return res.status(200).send(updatedGame);
    }

    // A tie has no winner
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { status: GameStatus.INDETERMINATE },
    });

    return res.status(200).send(updatedGame);
  } catch (e) {
    return res.status(500).send(`Could not update the game: ${e}`);
  }
}
