const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

const app = require('../../src/app');
const gameState = require('../../src/league');

describe('league app', function () {
  it('gets empty game state', function () {
    const game = app.startGame(gameState.createLeague());

    expect(game.sendCommand('print')).to.equal('No players yet');
  });

  it('adds a player to the game', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Bob');

    expect(game.sendCommand('print')).to.equal('-------------------\n|       Bob       |\n-------------------');
  });

  it('adds players to rows in a pyramid shape', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Alice');
    game.sendCommand('add player Bob');
    game.sendCommand('add player Charlotte');
    game.sendCommand('add player DAngelo');

    expect(game.sendCommand('print')).to.equal(
`                    -------------------
                    |      Alice      |
                    -------------------
          ------------------- -------------------
          |       Bob       | |    Charlotte    |
          ------------------- -------------------
------------------- ------------------- -------------------
|     DAngelo     | |                 | |                 |
------------------- ------------------- -------------------`
    );
  });

  it('shows the current winner', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Alice');
    game.sendCommand('add player Bob');

    expect(game.sendCommand('winner')).to.equal('Alice');
  });

  it('swaps players when a lower player wins a game', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Anil');
    game.sendCommand('add player Brian');
    game.sendCommand('add player Cara');

    game.sendCommand('record win Cara Anil');

    expect(game.sendCommand('print')).to.equal(
`          -------------------
          |      Cara       |
          -------------------
------------------- -------------------
|      Brian      | |      Anil       |
------------------- -------------------`
    );
  });

  it('rejects an invalid win', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Anil');
    game.sendCommand('add player Brian');
    game.sendCommand('add player Cara');

    game.sendCommand('record win Anil Cara');

    expect(game.sendCommand('print')).to.equal(
`          -------------------
          |      Anil       |
          -------------------
------------------- -------------------
|      Brian      | |      Cara       |
------------------- -------------------`
    );
  });

  describe('save to disk', function () {
    const tempDir = path.resolve(__dirname, 'tmp');

    before(function () {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
    });

    afterEach(function () {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
    });

    it('stores an empty game state to disk', function () {
      const game = app.startGame(gameState.createLeague());
      const absolutePath = getTemporaryFilePath('empty_game.json');

      game.sendCommand(`save ${absolutePath}`);

      const fileContents = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
      expect(fileContents).to.eql([]);
    });

    it('stores an in-progress game state to disk', function () {
      const game = app.startGame(gameState.createLeague());
      game.sendCommand('add player Alec');
      game.sendCommand('add player Barry');
      game.sendCommand('add player Cip');
      game.sendCommand('add player Deniz');

      const absolutePath = getTemporaryFilePath('in_progress_game.json');

      game.sendCommand(`save ${absolutePath}`);

      const fileContents = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
      expect(fileContents).to.eql([
        ['Alec'],
        ['Barry', 'Cip'],
        ['Deniz']
      ]);
    });

    it('does not save a file to a missing directory', function () {
      const game = app.startGame(gameState.createLeague());
      const path = getTemporaryFilePath('not_a_directory/game.json');

      const result = game.sendCommand(`save ${path}`);

      expect(result).to.contain('Could not save file');
      expect(fs.existsSync(path)).to.be.false;
    });

    function getTemporaryFilePath (name) {
      return path.resolve(__dirname, `tmp/${name}`);
    }
  });

  describe('load from disk', function () {
    it('loads an in-progress game', function () {
      const gameFile = path.resolve(__dirname, '../fixtures/in_progress_game.json');

      const game = app.startGame(gameState.createLeague());

      game.sendCommand(`load ${gameFile}`);

      expect(game.sendCommand('print')).to.equal(
`                    -------------------
                    |       Amy       |
                    -------------------
          ------------------- -------------------
          |    Berenice     | |     Carole      |
          ------------------- -------------------
------------------- ------------------- -------------------
|      Darla      | |                 | |                 |
------------------- ------------------- -------------------`
      );
    });

    it('does not load a game from a missing file', function () {
      const gameFile = path.resolve(__dirname, '../fixtures/some_unknown_file.json');

      const game = app.startGame(gameState.createLeague());
      game.sendCommand('add player Bob');

      const result = game.sendCommand(`load ${gameFile}`);

      expect(result).to.contain('Could not load file');
      expect(game.sendCommand('print')).to.equal(
`-------------------
|       Bob       |
-------------------`
      );
    });
  });
});
