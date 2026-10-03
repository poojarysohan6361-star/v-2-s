function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollWeighted(options) {
  const total = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * total;

  for (const opt of options) {
    random -= opt.weight;
    if (random <= 0) return opt.value;
  }

  return options[options.length - 1].value;
}

module.exports = { rollD6, rollWeighted };
