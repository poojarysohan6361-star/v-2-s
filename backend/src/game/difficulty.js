const { BOARD_SIZE, ZONES } = require("./config");

function getZone(tileNumber) {
  if (tileNumber <= 10) return 1;
  if (tileNumber <= 20) return 2;
  if (tileNumber <= 29) return 3;
  return "finale";
}

function getDifficultyWeights(tileNumber) {
  const zone = getZone(tileNumber);
  const zoneConfig = ZONES[zone];
  return [
    { value: "easy", weight: zoneConfig.easy },
    { value: "medium", weight: zoneConfig.medium },
    { value: "hard", weight: zoneConfig.hard },
  ];
}

module.exports = { getZone, getDifficultyWeights };
