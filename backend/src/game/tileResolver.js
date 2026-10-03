const { BOARD_SIZE, TILE_TYPES, TREASURE, PORTAL } = require("./config");
const { rollD6, rollWeighted } = require("./dice");
const { getDifficultyWeights } = require("./difficulty");
const { resolveEncounter } = require("./encounterTable");

function getTileLayout() {
  return TILE_TYPES.map((t) => ({ tile: t.tile, type: t.type }));
}

function rollMovement() {
  return rollD6();
}

function computeNewPosition(currentTile, roll) {
  const newPos = currentTile + roll;
  return Math.min(newPos, BOARD_SIZE);
}

function resolveTileEffect(tileNumber, revealedTiles) {
  const tileType = TILE_TYPES.find((t) => t.tile === tileNumber)?.type || "question";
  const alreadyRevealed = revealedTiles.includes(tileNumber);

  if (alreadyRevealed) {
    return { type: "already_revealed", tileNumber, needsReroll: true };
  }

  switch (tileType) {
    case "start":
      return { type: "start", tileNumber, needsReroll: true };
    case "checkpoint":
      return { type: "checkpoint", tileNumber, needsReroll: false };
    case "final_checkpoint":
      return { type: "final_checkpoint", tileNumber, difficulty: "final" };
    case "encounter":
      return resolveEncounterEffect(tileNumber);
    case "treasure":
      return resolveTreasureEffect(tileNumber);
    case "portal":
      return resolvePortalEffect(tileNumber);
    case "question":
    default:
      return resolveQuestionEffect(tileNumber);
  }
}

function resolveEncounterEffect(tileNumber) {
  const result = resolveEncounter();
  let scoreDelta = 0;
  let moveDelta = 0;

  switch (result.effect.type) {
    case "trap":
      scoreDelta = result.effect.scoreDelta;
      break;
    case "minor_blessing":
      scoreDelta = result.effect.scoreDelta;
      break;
    case "move_back":
      moveDelta = -result.effect.tiles;
      break;
    case "move_forward":
      moveDelta = result.effect.tiles;
      break;
    default:
      break;
  }

  return {
    type: "encounter",
    tileNumber,
    subRoll: result.roll,
    encounterType: result.effect.type,
    scoreDelta,
    moveDelta,
    needsReroll: false,
  };
}

function resolveTreasureEffect(tileNumber) {
  const useFlat = Math.random() > 0.5;
  let scoreDelta;

  if (useFlat) {
    scoreDelta = TREASURE.flatBonus;
  } else {
    scoreDelta =
      Math.floor(Math.random() * (TREASURE.randomBonusMax - TREASURE.randomBonusMin + 1)) +
      TREASURE.randomBonusMin;
  }

  return {
    type: "treasure",
    tileNumber,
    scoreDelta,
    needsReroll: false,
  };
}

function resolvePortalEffect(tileNumber) {
  const direction = Math.random() > 0.5 ? "forward" : "backward";

  let tiles;
  const range = direction === "forward" ? PORTAL.forwardRange : PORTAL.backwardRange;
  tiles =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  const moveDelta = direction === "forward" ? tiles : -tiles;

  return {
    type: "portal",
    tileNumber,
    direction,
    moveDelta,
    needsReroll: false,
  };
}

function resolveQuestionEffect(tileNumber) {
  const weights = getDifficultyWeights(tileNumber);
  const difficulty = rollWeighted(weights);

  return {
    type: "question",
    tileNumber,
    difficulty,
    pendingAnswer: true,
    needsReroll: false,
  };
}

function clampPosition(pos) {
  return Math.max(1, Math.min(pos, BOARD_SIZE));
}

module.exports = {
  getTileLayout,
  rollMovement,
  computeNewPosition,
  resolveTileEffect,
  clampPosition,
};
