require('mocha-sinon');
const chai = require('chai');
const expect = chai.expect;

const app = require('../src/app');
const fileServiceModule = require('../src/file_service');
const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');
const InvalidArgumentException = require('../src/invalid_argument_exception');

describe('app command processing', function () {
  it('prints the current state of the league', function () {
    const league = gameState.createLeague();
    const renderLeague = this.sinon.stub(leagueRenderer, 'render');
    renderLeague.withArgs(league).returns('rendered league');

    const game = app.startGame(league);
    expect(game.sendCommand('print')).to.equal('rendered league');
  });

  it('adds a player to the league', function () {
    const league = gameState.createLeague();
    const mockLeague = this.sinon.mock(league);

    mockLeague.expects('addPlayer').once();

    const game = app.startGame(league);
    game.sendCommand('add player some player');

    mockLeague.verify();
  });

  it('updates the league when a player wins', function () {
    const league = gameState.createLeague();
    const mockLeague = this.sinon.mock(league);

    mockLeague.expects('recordWin').withArgs('Bert', 'Ernie').once();

    const game = app.startGame(league);
    game.sendCommand('record win Bert Ernie');

    mockLeague.verify();
  });

  it('rejects invalid match results', function () {
    const league = gameState.createLeague();
    const recordWin = this.sinon.stub(league, 'recordWin');

    recordWin.withArgs('Bert', 'Ernie').throws(new InvalidArgumentException('some invalid result'));

    const game = app.startGame(league);
    const result = game.sendCommand('record win Bert Ernie');

    expect(result).to.equal('some invalid result');
  });

  it('shows the current winner', function () {
    const league = gameState.createLeague();
    const getWinner = this.sinon.stub(league, 'getWinner');
    getWinner.returns('name of the current winner');

    const game = app.startGame(league);
    expect(game.sendCommand('winner')).to.equal('name of the current winner');
  });

  it('saves the current state of the game to a file', function () {
    const league = gameState.createLeague();

    const fileService = this.sinon.mock(fileServiceModule);
    fileService.expects('save').withArgs('/some/filename.json', league);

    const game = app.startGame(league);

    game.sendCommand('save "/some/filename.json"');

    fileService.verify();
  });

  it('loads the state of the game from a file', function () {
    const newLeague = gameState.createLeague();
    newLeague.addPlayer('Alice');
    const loadFile = this.sinon.stub(fileServiceModule, 'load');
    loadFile.withArgs('/some/file/path').returns(newLeague);

    const game = app.startGame(gameState.createLeague());

    game.sendCommand('load "/some/file/path"');

    expect(game.sendCommand('winner')).to.equal('Alice');
  });

  it('returns the error message from an invalid argument', function () {
    const league = gameState.createLeague();
    const getWinner = this.sinon.stub(league, 'addPlayer');

    getWinner.withArgs('Simon').throws(new InvalidArgumentException('some exception message'));

    const game = app.startGame(league);
    expect(game.sendCommand('add player Simon')).to.equal('some exception message');
  });

  it('handles unknown commands', function () {
    const game = app.startGame(gameState.createLeague());

    const response = game.sendCommand('not a real command');

    expect(response).to.equal('Unknown command "not a real command"');
  });
});
