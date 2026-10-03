const { SCORE, HARD_QUESTION } = require("./config");
const { rollD6 } = require("./dice");

function resolveQuestionOutcome(difficulty, answerCorrect) {
  if (difficulty === "final") {
    if (answerCorrect) {
      return { outcome: "win", scoreDelta: 0 };
    }
    return { outcome: "wrong", scoreDelta: 0 };
  }

  if (difficulty === "hard") {
    return resolveHardOutcome(answerCorrect);
  }

  const scoreConfig = SCORE[difficulty];
  if (answerCorrect) {
    return { outcome: "correct", scoreDelta: scoreConfig.correct };
  }
  return { outcome: "wrong", scoreDelta: scoreConfig.wrong };
}

function resolveHardOutcome(answerCorrect) {
  if (answerCorrect) {
    const bonusTiles =
      Math.floor(
        Math.random() * (HARD_QUESTION.bonusForwardMax - HARD_QUESTION.bonusForwardMin + 1)
      ) + HARD_QUESTION.bonusForwardMin;
    return {
      outcome: "correct",
      scoreDelta: SCORE.hard.correct,
      bonusForward: bonusTiles,
    };
  }

  const mitigationRoll = rollD6();
  const penaltyReduction =
    mitigationRoll <= HARD_QUESTION.mitigationRollMax ? mitigationRoll : 0;
  const moveBack = HARD_QUESTION.penaltyBackBase - penaltyReduction;

  return {
    outcome: "wrong",
    scoreDelta: SCORE.hard.wrong,
    moveBack,
  };
}

module.exports = { resolveQuestionOutcome };
