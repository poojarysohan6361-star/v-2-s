const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const players = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

  for (const name of players) {
    const player = await prisma.player.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.run.create({
      data: {
        playerId: player.id,
        currentTile: 1,
        score: 0,
        status: "in_progress",
      },
    });

    console.log(`Created player: ${name}`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
