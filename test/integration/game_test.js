const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');


const app = require('../../src/app');
const gameState = require('../../src/league');

describe('JSON files for league app test suite', function (){
  //TODO: test for input file to be present
  it('test-input.json is present and contains expected data', function () {
    const filename = 'test-input.json';
    let filePresent = fs.existsSync(filename);
    expect(filePresent).to.be.true;
    if(filePresent){
      let fileContents = fs.readFileSync(filename, {encoding: 'UTF8'});
      expect(fileContents).to.equal('[["Player1"],["Player2","Player3"]]\n');
    }
  });
});

describe('league app', function () {
  it('prints empty game state', function () {
    const game = app.startGame(gameState.createLeague());

    expect(game.sendCommand('print')).to.equal('No players yet');
  });

  it('adds players and prints league', function () {
    let game = app.startGame(gameState.createLeague());

    game.sendCommand('add player Player1');
    game.sendCommand('add player Player2');
    let printedOutput = game.sendCommand('print');
    expect(printedOutput).to.equal(`          -------------------
          |     Player1     |
          -------------------
------------------- -------------------
|     Player2     | |                 |
------------------- -------------------`);
  });

  it('opens files, parses content, and prints correctly', function () {
    let game = app.startGame(gameState.createLeague());

    game.sendCommand('load test-input.json');
    let printedOutput = game.sendCommand('print');
    expect(printedOutput).to.equal(`          -------------------
          |     Player1     |
          -------------------
------------------- -------------------
|     Player2     | |     Player3     |
------------------- -------------------`);
  });

  it('saves file describing populated leagues', function () {

    //Set up game and save file
    let game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Player1');
    game.sendCommand('add player Player2');
    let dateString = new Date().toISOString();
    let fileName = `test-${dateString}.json`;
    game.sendCommand(`save ${fileName}`);

    //confirm file exists
    let filePresent = fs.existsSync(fileName);
    //read file that was just saved
    let fileContents = fs.readFileSync(fileName, {encoding: 'UTF8'});

    //delete the file to avoid clutter in project folder
    fs.unlink(fileName, (err) => {
      if (err){
        throw err;
      }
    });

    //assert file present with correct contents
    expect(filePresent).to.be.true;
    expect(fileContents).to.equal('[["Player1"],["Player2"]]');
  });

  it('saves file describing emptry league', function () {

    //Set up empty league and save file
    let game = app.startGame(gameState.createLeague());
    let dateString = new Date().toISOString();
    let fileName = `test-${dateString}.json`;
    game.sendCommand(`save ${fileName}`);

    //confirm file exists
    let filePresent = fs.existsSync(fileName);
    //read file that was just saved
    let fileContents = fs.readFileSync(fileName, {encoding: 'UTF8'});

    //delete the file to avoid clutter in project folder
    fs.unlink(fileName, (err) => {
      if (err){
        throw err;
      }
    });

    //assert file present with correct contents
    expect(filePresent).to.be.true;
    expect(fileContents).to.equal('[]');
  });
});
