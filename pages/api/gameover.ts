import prisma from '@/prisma/prismaClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return PostHandler(req, res);
  return res.status(405).send('Method not allowed');
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const { winnerID, gameId } = req.body as { winnerID: string; gameId: string };

  const game = await prisma.game.findFirst({
    where: { id: gameId },
  });

  const winner = await prisma.player.findUnique({
    where: { id: winnerID },
  });

  if (game && winner) {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { winnerID, status: 'finished' },
    });

    await prisma.player.update({
      where: { id: winnerID },
      data: { wins: winner.wins + 1 },
    });

    return res.status(200).send(updatedGame);
  }
}
