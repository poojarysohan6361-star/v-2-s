const { getPrisma } = require("../config/db");

async function getLeaderboard() {
  const prisma = getPrisma();

  const completedRuns = await prisma.run.findMany({
    where: { status: { in: ["completed", "force_ended"] } },
    include: { player: { select: { name: true } } },
    orderBy: [
      { score: "desc" },
      { currentTile: "desc" },
      { completedAt: "asc" },
    ],
  });

  return completedRuns.map((run, index) => ({
    rank: index + 1,
    playerName: run.player.name,
    score: run.score,
    tileReached: run.currentTile,
    status: run.status,
    completedAt: run.completedAt,
    startedAt: run.startedAt,
  }));
}

async function getAllPlayerStates() {
  const prisma = getPrisma();

  const runs = await prisma.run.findMany({
    include: {
      player: { select: { name: true } },
      revealedTiles: { select: { tileNumber: true } },
    },
    orderBy: { lastMoveAt: "desc" },
  });

  return runs.map((run) => ({
    runId: run.id,
    playerName: run.player.name,
    currentTile: run.currentTile,
    score: run.score,
    status: run.status,
    revealedTiles: run.revealedTiles.map((r) => r.tileNumber),
    startedAt: run.startedAt,
    lastMoveAt: run.lastMoveAt,
    completedAt: run.completedAt,
  }));
}

module.exports = { getLeaderboard, getAllPlayerStates };
