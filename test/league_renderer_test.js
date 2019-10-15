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

  it('makes box boundaries of appropriate length', function () {
    const league = gameState.createLeague();
    league.addPlayer('Player1');
    league.addPlayer('Player2');
    league.addPlayer('Player3');
    let rendered = leagueRenderer.render(league);
    rendered = rendered.split('\n');
    const boundaryTopRow1 = rendered[0];
    const boundaryBottomRow1 = rendered[2];
    const boundaryTopRow2 = rendered[3];
    const boundaryBottomRow2 = rendered[5];
    const boundaryRegex = /-{19}/g;

    //in while loops below there'll be a loop for each instance of a regex match in the string
    //object is something to store counters for each loop

    let boundaryCounts = {
      topRow1:0,
      bottomRow1:0,
      topRow2:0,
      bottomRow2:0,
    };

    //While loop conditions don't work without assigning the return value from .exec() to a variable
    let holdingVariable;

    while(( holdingVariable = boundaryRegex.exec(boundaryTopRow1)) !== null){
      boundaryCounts.topRow1 = boundaryCounts.topRow1 + 1;
    }

    while( (holdingVariable = boundaryRegex.exec(boundaryBottomRow1)) !== null){
      boundaryCounts.bottomRow1 = boundaryCounts.bottomRow1 + 1;
    }

    while((holdingVariable = boundaryRegex.exec(boundaryTopRow2)) !== null){
      boundaryCounts.topRow2 = boundaryCounts.topRow2 + 1;
    }

    while((holdingVariable = boundaryRegex.exec(boundaryBottomRow2)) !== null){
      boundaryCounts.bottomRow2 = boundaryCounts.bottomRow2 + 1;
    }

    expect(boundaryCounts.topRow1).to.equal(1);
    expect(boundaryCounts.bottomRow1).to.equal(1);
    expect(boundaryCounts.topRow2).to.equal(2);
    expect(boundaryCounts.bottomRow2).to.equal(2);
  });
});
