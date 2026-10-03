const express = require("express");
const { handleMove, handleAnswer, handleGetState } = require("../controllers/run.controller");

const router = express.Router();

router.post("/", handleMove);
router.get("/state/:playerName", handleGetState);

module.exports = router;
