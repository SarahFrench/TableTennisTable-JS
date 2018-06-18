const fs = require('fs');
const gameState = require('./league');
const path = require('path');

exports.save = function (absolutePath, league) {
  const players = league.getPlayers();
  try {
    fs.writeFileSync(absolutePath, JSON.stringify(players), { flag: 'w' });
  } catch (e) {
    if (e.code === "ENOENT") {
      return `Could not save file to ${absolutePath}`;
    }
    throw e;
  }
};

exports.load = function (absolutePath) {
  return gameState.load(JSON.parse(fs.readFileSync(absolutePath, 'utf8')));
};
