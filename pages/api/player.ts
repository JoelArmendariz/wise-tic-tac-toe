import prisma from '@/prisma/prismaClient';
import { Player } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return PostHandler(req, res);
  if (req.method === 'GET') return GetHandler(req, res);
  return res.status(405).send('Method not allowed');
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const player: Player = req.body;

  try {
    const existingPlayer = await prisma.player.findFirst({
      where: {
        name: player.name,
      },
    });

    if (existingPlayer) {
      return res.json(existingPlayer);
    }

    const newPlayer = await prisma.player.create({
      data: player,
    });

    return res.status(200).json(newPlayer);
  } catch (e) {
    return res.status(500).send(`Could not create player: ${e}`);
  }
}

async function GetHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  try {
    if (id) {
      const player = await prisma.player.findUnique({
        where: { id },
      });
      if (player) {
        return res.json(player);
      }
    } else {
      const allPlayers = await prisma.player.findMany();
      return res.status(200).json(allPlayers);
    }
  } catch (e) {
    return res.status(404).send(`Could not find player: ${e}`);
  }
}
