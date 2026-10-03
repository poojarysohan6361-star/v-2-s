const BOARD_SIZE = 30;

const ZONES = {
  1: { min: 1, max: 10, easy: 70, medium: 25, hard: 5 },
  2: { min: 11, max: 20, easy: 20, medium: 60, hard: 20 },
  3: { min: 21, max: 29, easy: 5, medium: 25, hard: 70 },
  finale: { min: 30, max: 30, easy: 0, medium: 0, hard: 100 },
};

const SCORE = {
  easy: { correct: 100, wrong: -50 },
  medium: { correct: 200, wrong: -100 },
  hard: { correct: 350, wrong: -150 },
};

const HARD_QUESTION = {
  bonusForwardMin: 1,
  bonusForwardMax: 4,
  penaltyBackBase: 6,
  mitigationRollMax: 5,
};

const ENCOUNTER = {
  1: { type: "trap", scoreDelta: -75 },
  2: { type: "nothing" },
  3: { type: "nothing" },
  4: { type: "minor_blessing", scoreDelta: 50 },
  5: { type: "move_back", tiles: 1 },
  6: { type: "move_forward", tiles: 1 },
};

const TREASURE = {
  flatBonus: 150,
  randomBonusMin: 50,
  randomBonusMax: 300,
};

const PORTAL = {
  forwardRange: { min: 1, max: 3 },
  backwardRange: { min: 2, max: 5 },
};

const TILE_TYPES = (() => {
  const types = [];

  for (let i = 1; i <= BOARD_SIZE; i++) {
    if (i === 1) {
      types.push({ tile: i, type: "start" });
    } else if (i === 30) {
      types.push({ tile: i, type: "final_checkpoint" });
    } else if (i === 25) {
      types.push({ tile: i, type: "checkpoint" });
    } else {
      types.push({ tile: i, type: "question" });
    }
  }

  const encounterTiles = [5, 12, 17, 22, 28];
  encounterTiles.forEach((t) => {
    const entry = types.find((x) => x.tile === t);
    if (entry) entry.type = "encounter";
  });

  const treasureTiles = [8, 18, 26];
  treasureTiles.forEach((t) => {
    const entry = types.find((x) => x.tile === t);
    if (entry) entry.type = "treasure";
  });

  const portalTiles = [14, 23];
  portalTiles.forEach((t) => {
    const entry = types.find((x) => x.tile === t);
    if (entry) entry.type = "portal";
  });

  return types;
})();

function getTileType(tileNumber) {
  const entry = TILE_TYPES.find((t) => t.tile === tileNumber);
  return entry ? entry.type : "question";
}

module.exports = {
  BOARD_SIZE,
  ZONES,
  SCORE,
  HARD_QUESTION,
  ENCOUNTER,
  TREASURE,
  PORTAL,
  TILE_TYPES,
  getTileType,
};
