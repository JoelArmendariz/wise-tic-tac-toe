import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // await prisma.Player.update({
  //   where: {
  //     id: "6553c008dac8cd74b0857f03",
  //   },
  //   data: {
  //     wins: 0,
  //   },
  // });

  await prisma.Game.create({
    data: {
      board: "['-', '-', '-'],['-', '-', '-'],['-', '-', '-']",
      playerIDs: ["6553c008dac8cd74b0857f03", "6553bfd0d2b2ea4aeb2e7270"],
      currentPlayerID: "6553c008dac8cd74b0857f03",
      ownerID: "6553c008dac8cd74b0857f03",
    },
  });

  // const allPlayers = await prisma.Player.findMany();
  const allGames = await prisma.Game.findMany();

  // console.log(allPlayers);
  console.log(allGames);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
