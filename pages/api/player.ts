import prisma from "@/prisma/prismaClient";
import { Player } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") return PostHandler(req, res);
  return res.status(405).send("Method not allowed");
}

async function PostHandler(req: NextApiRequest, res: NextApiResponse) {
  const player: Player = req.body;

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
}
