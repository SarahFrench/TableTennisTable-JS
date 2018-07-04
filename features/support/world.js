const { setWorldConstructor } = require('cucumber');

const app = require('../../src/app');
const gameState = require('../../src/league');

class GameWorld {
  constructor () {
    this.game = app.startGame(gameState.createLeague());
  }
}

setWorldConstructor(GameWorld);
