/**
 * This is a dev script for interacting with the database programatically via prisma
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.Game.create({
    data: {
      board: "['-', '-', '-'],['-', '-', '-'],['-', '-', '-']",
      playerIDs: ['6553c008dac8cd74b0857f03', '6553bfd0d2b2ea4aeb2e7270'],
      currentPlayerID: '6553c008dac8cd74b0857f03',
      ownerID: '6553c008dac8cd74b0857f03',
    },
  });

  const allGames = await prisma.Game.findMany();

  console.log(allGames);
}

main()
  .catch(async e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
