const { getPrisma } = require("../config/db");
const { rollMovement, computeNewPosition, resolveTileEffect, clampPosition } = require("../game/tileResolver");
const { BOARD_SIZE } = require("../game/config");

async function getOrCreatePlayer(playerName) {
  const prisma = getPrisma();
  let player = await prisma.player.findUnique({ where: { name: playerName } });
  if (!player) {
    player = await prisma.player.create({ data: { name: playerName } });
  }
  return player;
}

async function getOrCreateRun(playerId) {
  const prisma = getPrisma();
  let run = await prisma.run.findFirst({
    where: { playerId, status: "in_progress" },
  });

  if (!run) {
    run = await prisma.run.create({
      data: {
        playerId,
        currentTile: 1,
        score: 0,
        status: "in_progress",
      },
    });
  }

  return run;
}

async function executeMove(playerName) {
  const prisma = getPrisma();
  const player = await getOrCreatePlayer(playerName);
  const run = await getOrCreateRun(player.id);

  if (run.status !== "in_progress") {
    return { error: "Run is not in progress", run };
  }

  const revealedRecords = await prisma.revealedTile.findMany({
    where: { runId: run.id },
    select: { tileNumber: true },
  });
  const revealedTiles = revealedRecords.map((r) => r.tileNumber);

  let newPosition;
  let roll;
  let effect;
  let needsReroll = true;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  while (needsReroll && attempts < MAX_ATTEMPTS) {
    roll = rollMovement();
    newPosition = computeNewPosition(run.currentTile, roll);
    effect = resolveTileEffect(newPosition, revealedTiles);
    needsReroll = effect.needsReroll;
    attempts++;
  }

  if (needsReroll) {
    // If every attempt landed on an already-revealed tile, accept the move without rerolling
    effect = { type: "already_revealed", tileNumber: newPosition, needsReroll: false };
  }

  if (!revealedTiles.includes(newPosition)) {
    await prisma.revealedTile.create({
      data: { runId: run.id, tileNumber: newPosition },
    });
    revealedTiles.push(newPosition);
  }

  await prisma.run.update({
    where: { id: run.id },
    data: {
      currentTile: newPosition,
      lastMoveAt: new Date(),
    },
  });

  return {
    runId: run.id,
    roll,
    newPosition,
    previousTile: run.currentTile,
    effect,
    currentScore: run.score,
  };
}

async function getRunState(playerName) {
  const prisma = getPrisma();
  const player = await prisma.player.findUnique({ where: { name: playerName } });
  if (!player) return null;

  const run = await prisma.run.findFirst({
    where: { playerId: player.id, status: "in_progress" },
    include: { revealedTiles: { select: { tileNumber: true } } },
  });

  if (!run) return null;

  return {
    runId: run.id,
    playerName,
    currentTile: run.currentTile,
    score: run.score,
    status: run.status,
    revealedTiles: run.revealedTiles.map((r) => r.tileNumber),
    startedAt: run.startedAt,
    lastMoveAt: run.lastMoveAt,
    pendingDifficulty: run.pendingDifficulty,
    pendingTile: run.pendingTile,
  };
}

async function forceEndAllRuns() {
  const prisma = getPrisma();

  const updated = await prisma.run.updateMany({
    where: { status: "in_progress" },
    data: {
      status: "force_ended",
      completedAt: new Date(),
    },
  });

  return { forceEndedCount: updated.count };
}

module.exports = {
  getOrCreatePlayer,
  getOrCreateRun,
  executeMove,
  getRunState,
  forceEndAllRuns,
};
