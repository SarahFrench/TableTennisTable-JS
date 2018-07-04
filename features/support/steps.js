const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

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

When('I print the league', function () {
  this.response = this.game.sendCommand('print');
});

When('I check the winner', function () {
  this.response = this.game.sendCommand('winner');
});

When('{string} wins a match against {string}', function (winner, loser) {
  this.game.sendCommand(`record win ${winner} ${loser}`);
});

Then('I should see that there are no players', function () {
  expect(this.response).to.equal('No players yet');
});

Then('I should see {string} in row {int}', function (player, rowNumber) {
  const outputLines = this.response.split('\n');
  const playerLineIndex = 3 * rowNumber - 2;
  const playerLine = outputLines[playerLineIndex];

  const actualNames = playerLine.match(/\w+/g);

  expect(actualNames).to.contain(player);
});

Then('I should see that {string} is the winner', function (player) {
  expect(this.response).to.equal(player);
});
