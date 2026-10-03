const express = require("express");
const { handleAnswer } = require("../controllers/run.controller");

const router = express.Router();

router.post("/", handleAnswer);

module.exports = router;
