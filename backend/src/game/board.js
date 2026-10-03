const { getTileType } = require("./config");

function getBoardLayout() {
  const tiles = [];
  for (let i = 1; i <= 30; i++) {
    tiles.push({ tile: i, type: getTileType(i) });
  }
  return tiles;
}

module.exports = { getBoardLayout };
