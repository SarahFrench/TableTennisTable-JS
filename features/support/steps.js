const { Given, When, Then, BeforeAll, After } = require('cucumber');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

const app = require('../../src/app');
const gameState = require('../../src/league');

const temporaryDirectory = path.resolve(__dirname, 'tmp');

BeforeAll(function () {
  if (!fs.existsSync(temporaryDirectory)) {
    fs.mkdirSync(temporaryDirectory);
  }
});

After(function () {
  const files = fs.readdirSync(temporaryDirectory);
  for (const file of files) {
    fs.unlinkSync(path.join(temporaryDirectory, file));
  }
});

Given('the league has no players', function () {
  // Nothing to do because a new league always has no players
});

Given('the league has players:', function (data) {
  const game = this.game;
  data.raw().forEach(function (tableRow) {
    const name = tableRow[0];
    game.sendCommand(`add player ${name}`);
  });
});

When('I start a new game', function () {
  this.game = app.startGame(gameState.createLeague());
});

When('I print the league', function () {
  this.response = this.game.sendCommand('print');
});

When('I check the winner', function () {
  this.response = this.game.sendCommand('winner');
});

When('{string} wins a match against {string}', function (winner, loser) {
  this.game.sendCommand(`record win ${winner} ${loser}`);
});

When('I save the game to {string}', function (filename) {
  const filepath = path.resolve(__dirname, `tmp/${filename}`);
  this.game.sendCommand(`save ${filepath}`);
});

When('I load the game from {string}', function (filename) {
  // TODO: Extract to tmp function
  const filepath = path.resolve(__dirname, `tmp/${filename}`);
  this.game.sendCommand(`load ${filepath}`);
});

Then('I should see that there are no players', function () {
  expect(this.response).to.equal('No players yet');
});

Then('I should see {string} in row {int}', function (player, rowNumber) {
  const outputLines = this.response.split('\n');
  expect(outputLines).to.have.lengthOf.at.least(3 * rowNumber, 'Row does not exist');

  const playerLineIndex = 3 * rowNumber - 2;
  const playerLine = outputLines[playerLineIndex];

  const actualNames = playerLine.match(/\w+/g);
  expect(actualNames).to.contain(player);
});

Then('I should see that {string} is the winner', function (player) {
  expect(this.response).to.equal(player);
});
