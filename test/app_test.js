require('mocha-sinon');
const chai = require('chai');
const expect = chai.expect;

const app = require('../src/app');
const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');

describe('app command processing', function () {
  it('prints the current state of the league', function () {
    const league = gameState.createLeague();
    const renderLeague = this.sinon.stub(leagueRenderer, 'render');
    renderLeague.withArgs(league).returns('rendered league');

    const game = app.startGame(league);
    expect(game.sendCommand('print')).to.equal('rendered league');
  });

  it('adds a player', function () {
    const league = gameState.createLeague();
    const addPlayerSpy = this.sinon.spy(league, 'addPlayer');

    const game = app.startGame(league);
    game.sendCommand('add player Alice');

    expect(addPlayerSpy.withArgs('Alice').calledOnce).to.be.true;
  });

  it('returns the league\'s winner', function () {
    const league = gameState.createLeague();
    const getWinnerStub = this.sinon.stub(league, 'getWinner');
    getWinnerStub.returns('the winner is returned');

    const game = app.startGame(league);

    expect(game.sendCommand('winner')).to.equal('the winner is returned');
  });

  it('records a win when two players given', function () {
    const league = gameState.createLeague();
    const game = app.startGame(league);
    game.sendCommand('add player Player1');
    game.sendCommand('add player Player2');
    const recordWinSpy = this.sinon.spy(league, 'recordWin');
    game.sendCommand('record win Player2 Player1');

    expect(recordWinSpy.withArgs('Player2', 'Player1').calledOnce).to.be.true;
  });

  it('handles unknown commands', function () {
    const league = gameState.createLeague();
    const game = app.startGame(league);
    const command = 'this is an invalid command';

    expect(game.sendCommand(command)).to.equal(`Unknown command "${command}"`);
  });
});
