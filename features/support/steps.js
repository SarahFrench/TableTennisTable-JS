const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');

Given('the league has no players', function () {
  // Nothing to do because a new league always has no players
});

Given('that I add player {string}', function (player) {
  this.response = this.game.sendCommand(`add player ${player}`);
});

When('I send incorrect command {string} to the app', function (string) {
  this.command = string;
  this.response = this.game.sendCommand(string);
});

When('I record {string} winning against {string}', function (string1, string2) {
  this.originalOrder = this.game.sendCommand('print');
  this.response = this.game.sendCommand(`record win ${string1} ${string2}`);
});

When('I print the league', function () {
  this.response = this.game.sendCommand('print');
});

When('I print the winner', function () {
  this.response = this.game.sendCommand('winner');
});

Then('I should see that there are no players', function () {
  expect(this.response).to.equal('No players yet');
});

Then('I should see nothing is returned', function () {
  expect(this.response).to.be.null;
});

Then('I should see an unknown command error message', function () {
  expect(this.response).to.equal(`Unknown command "${this.command}"`);
});

Then('I should see that there are {int} players', function (int) {
  expect(this.response.match(/Player/g)).to.have.lengthOf(int);
});

Then('I should not see anyone/somebody in position {int}', function (int) {
  let allPlayersRegExp = /\|\s+\w{1,17}\.{0,3}\s+\|/g;
  let allPlayers = this.response.match(allPlayersRegExp);
  expect(allPlayers.length < int).to.be.true;
});

Then('I should see {string} in position {int}', function (string, int) {
  let position = int - 1; //Adjust to 0 indexing
  let allPlayersRegExp = /\|\s+\w{1,17}\.{0,3}\s+\|/g;
  let specificPlayerRegExp = new RegExp(string, 'g');
  let allPlayers = this.response.match(allPlayersRegExp);
  expect(specificPlayerRegExp.test(allPlayers[position])).to.be.true;
});

Then('I should see they have not swapped places', function () {
  //TODO: also a test for the thrown exception? Doesn't seem accessible
  let originalOrder = this.originalOrder;
  let currentOrder = this.game.sendCommand('print');

  expect(currentOrder).to.equal(originalOrder);
});
