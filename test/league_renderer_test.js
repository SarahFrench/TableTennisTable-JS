const chai = require('chai');
const expect = chai.expect;

const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');

describe('leagueRenderer', function () {
  it('states that the league is empty', function () {
    const league = gameState.createLeague();
    const rendered = leagueRenderer.render(league);
    expect(rendered).to.equal('No players yet');
  });

  it('leaves 17 char names unabbreviated', function () {
    const league = gameState.createLeague();
    league.addPlayer('0123456789ABCDEFG');
    const rendered = leagueRenderer.render(league);
    expect(rendered).to.equal('-------------------\n|0123456789ABCDEFG|\n-------------------');
    expect(/\.\.\./.test(rendered)).to.equal(false);
  });

  it('abbreviates 18 char names', function () {
    const league = gameState.createLeague();
    league.addPlayer('0123456789ABCDEFGH');
    const rendered = leagueRenderer.render(league);
    expect(rendered).to.equal('-------------------\n|0123456789ABCD...|\n-------------------');
    expect(/\.\.\./.test(rendered)).to.equal(true);
  });
});
