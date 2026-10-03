const { executeMove, getRunState } = require("../services/run.service");
const { resolveQuestionOutcome } = require("../game/questionOutcome");
const { getPrisma } = require("../config/db");
const { clampPosition } = require("../game/tileResolver");
const { BOARD_SIZE } = require("../game/config");

async function handleMove(req, res, next) {
  try {
    const { playerName } = req.body;
    if (!playerName) {
      return res.status(400).json({ error: "playerName is required" });
    }

    const result = await executeMove(playerName);
    if (result.error) {
      return res.status(400).json(result);
    }

    if (result.effect.type === "final_checkpoint") {
      const prisma = getPrisma();
      await prisma.run.update({
        where: { id: result.runId },
        data: {
          pendingDifficulty: "final",
          pendingTile: result.newPosition,
        },
      });
      return res.json({
        ...result,
        promptAnswer: true,
        difficulty: "final",
        tileNumber: result.newPosition,
      });
    }

    if (result.effect.type === "question") {
      const prisma = getPrisma();
      await prisma.run.update({
        where: { id: result.runId },
        data: {
          pendingDifficulty: result.effect.difficulty,
          pendingTile: result.effect.tileNumber,
        },
      });
      return res.json({
        ...result,
        promptAnswer: true,
        difficulty: result.effect.difficulty,
        tileNumber: result.effect.tileNumber,
      });
    }

    if (result.effect.type === "encounter" && result.effect.scoreDelta !== 0) {
      const prisma = getPrisma();
      const updated = await prisma.run.update({
        where: { id: result.runId },
        data: { score: { increment: result.effect.scoreDelta } },
      });
      result.currentScore = updated.score;
    }

    if (result.effect.type === "treasure") {
      const prisma = getPrisma();
      const updated = await prisma.run.update({
        where: { id: result.runId },
        data: { score: { increment: result.effect.scoreDelta } },
      });
      result.currentScore = updated.score;
    }

    if (result.effect.type === "portal") {
      const prisma = getPrisma();
      const newPos = clampPosition(result.newPosition + result.effect.moveDelta);
      await prisma.run.update({
        where: { id: result.runId },
        data: { currentTile: newPos },
      });
      result.newPosition = newPos;
      result.portalApplied = true;
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleAnswer(req, res, next) {
  try {
    const { playerName, answer } = req.body;
    if (!playerName || answer === undefined) {
      return res.status(400).json({ error: "playerName and answer are required" });
    }

    const prisma = getPrisma();
    const { getOrCreatePlayer, getOrCreateRun } = require("../services/run.service");
    const player = await getOrCreatePlayer(playerName);
    const run = await getOrCreateRun(player.id);

    if (run.status !== "in_progress") {
      return res.status(400).json({ error: "Run is not in progress" });
    }

    if (!run.pendingDifficulty || !run.pendingTile) {
      return res.status(400).json({ error: "No pending question to answer" });
    }

    const isCorrect = answer === true || answer === "correct";
    const result = resolveQuestionOutcome(run.pendingDifficulty, isCorrect);

    await prisma.questionLog.create({
      data: {
        runId: run.id,
        tileNumber: run.pendingTile,
        difficulty: run.pendingDifficulty,
        answer: isCorrect ? "correct" : "wrong",
        correct: isCorrect,
        scoreDelta: result.scoreDelta,
      },
    });

    if (result.outcome === "win") {
      await prisma.run.update({
        where: { id: run.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          pendingDifficulty: null,
          pendingTile: null,
        },
      });
      return res.json({
        outcome: "win",
        message: "Congratulations! You completed the quest!",
        finalScore: run.score,
      });
    }

    const newScore = run.score + result.scoreDelta;
    const updateData = {
      score: newScore,
      pendingDifficulty: null,
      pendingTile: null,
      lastMoveAt: new Date(),
    };

    if (result.outcome === "wrong" && run.pendingDifficulty === "hard") {
      const newPos = clampPosition(run.currentTile - result.moveBack);
      updateData.currentTile = newPos;
    }

    if (result.outcome === "correct" && result.bonusForward) {
      const newPos = clampPosition(run.currentTile + result.bonusForward);
      updateData.currentTile = newPos;
    }

    const updatedRun = await prisma.run.update({
      where: { id: run.id },
      data: updateData,
    });

    res.json({
      outcome: result.outcome,
      scoreDelta: result.scoreDelta,
      newScore: updatedRun.score,
      currentTile: updatedRun.currentTile,
      ...(result.moveBack && { moveBack: result.moveBack }),
      ...(result.bonusForward && { bonusForward: result.bonusForward }),
    });
  } catch (err) {
    next(err);
  }
}

async function handleGetState(req, res, next) {
  try {
    const { playerName } = req.params;
    const state = await getRunState(playerName);
    if (!state) {
      return res.status(404).json({ error: "No active run found for this player" });
    }
    res.json(state);
  } catch (err) {
    next(err);
  }
}

module.exports = { handleMove, handleAnswer, handleGetState };
