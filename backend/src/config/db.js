const { PrismaClient } = require("@prisma/client");

let prisma;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

module.exports = { getPrisma, disconnect };
