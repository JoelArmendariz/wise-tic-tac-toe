import prisma from "@/prisma/prismaClient";
import { Player } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") return PostHandler(req, res);
  if (req.method === "GET") return GetHandler(req, res);
  if (req.method === "PUT") return PutHandler(req, res);
  return res.status(405).send("Method not allowed");
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const player: Player = req.body;

  const game = await prisma.game.create({
    data: {
      board: JSON.stringify([
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"],
      ]),
      playerIDs: [player.id],
      ownerID: player.id,
      currentPlayerID: player.id,
    },
  });

  return res.status(200).send(game);
}

async function GetHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  const game = await prisma.game.findFirst({
    where: { id },
  });

  if (game) {
    return res.status(200).send(game);
  }
}

async function PutHandler(req: NextApiRequest, res: NextApiResponse) {
  const { player, gameId } = req.body as { player: Player; gameId: string };

  const game = await prisma.game.findFirst({
    where: { id: gameId },
  });

  if (game) {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        playerIDs: [...game.playerIDs, player.id],
      },
    });
    return res.status(200).send(updatedGame);
  }
}
