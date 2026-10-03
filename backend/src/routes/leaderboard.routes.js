const express = require("express");
const { handleLeaderboard } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/", handleLeaderboard);

module.exports = router;
