const { getLeaderboard, getAllPlayerStates } = require("../services/ranking.service");
const { getBoardLayout } = require("../game/board");
const { forceEndAllRuns } = require("../services/run.service");

async function handleLeaderboard(req, res, next) {
  try {
    const leaderboard = await getLeaderboard();
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

async function handleAdminDashboard(req, res, next) {
  try {
    const boardLayout = getBoardLayout();
    const playerStates = await getAllPlayerStates();

    res.json({
      boardLayout,
      players: playerStates,
      totalPlayers: playerStates.length,
      activePlayers: playerStates.filter((p) => p.status === "in_progress").length,
    });
  } catch (err) {
    next(err);
  }
}

async function handleForceEnd(req, res, next) {
  try {
    const result = await forceEndAllRuns();
    res.json({
      message: "All runs have been force-ended",
      forceEndedCount: result.forceEndedCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleLeaderboard, handleAdminDashboard, handleForceEnd };
