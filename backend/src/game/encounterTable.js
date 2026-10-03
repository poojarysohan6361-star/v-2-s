const { ENCOUNTER } = require("./config");
const { rollD6 } = require("./dice");

function resolveEncounter() {
  const roll = rollD6();
  const effect = ENCOUNTER[roll];

  return {
    roll,
    effect,
  };
}

module.exports = { resolveEncounter };
