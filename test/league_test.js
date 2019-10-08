const chai = require('chai');
const expect = chai.expect;

const gameState = require('../src/league');

describe('league', function () {
  describe('#addPlayer', function () {
    it('adds a player to the game', function () {
      const league = gameState.createLeague();
      league.addPlayer('Bob');

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(1);
      expect(players[0]).to.have.members(['Bob']);
    });

    it('players are added from top row downwards', function () {
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      const players1 = league.getPlayers();
      league.addPlayer('Player2');
      league.addPlayer('Player3');
      const players2 = league.getPlayers();
      league.addPlayer('Player4');
      league.addPlayer('Player5');
      league.addPlayer('Player6');
      const players3 = league.getPlayers();

      expect(players1).to.have.lengthOf(1);
      expect(players1[0][0]).to.equal('Player1');
      expect(players2).to.have.lengthOf(2);
      expect(players2[0][0]).to.equal('Player1');
      expect(players2[1][0]).to.equal('Player2');
      expect(players2[1][1]).to.equal('Player3');
      expect(players3).to.have.lengthOf(3);
      expect(players3[0][0]).to.equal('Player1');
      expect(players3[1][0]).to.equal('Player2');
      expect(players3[1][1]).to.equal('Player3');
      expect(players3[2][0]).to.equal('Player4');
      expect(players3[2][1]).to.equal('Player5');
      expect(players3[2][2]).to.equal('Player6');
    });

    it('doesn\'t add players with repeated names', function () {
      const league = gameState.createLeague();
      const repeatedName = 'Alice';

      const addingNameTwice = function (){
        league.addPlayer(repeatedName);
        league.addPlayer(repeatedName);
      };

      expect(addingNameTwice).to.throw(`Cannot add player '${repeatedName}' because they are already in the game`);
    });

    it('doesn\'t add players with names containing spaces', function () {
      //Given
      const league = gameState.createLeague();
      const invalidName = 'Bob Bobson';

      //When
      const addingInvalidName = function (){
        league.addPlayer(invalidName);
      };

      //Then
      expect(addingInvalidName).to.throw(`Player name ${invalidName} contains invalid characters`);
    });

    it('doesn\'t add players when no name is entered', function () {
      //Given
      const league = gameState.createLeague();
      const noName = '';

      //When
      const addingNoName = function (){
        league.addPlayer(noName);
      };

      //Then
      expect(addingNoName).to.throw(`Player name ${noName} contains invalid characters`);
    });
  });

  describe('#getPlayers', function () {
    it('returns expected output for 0 players', function () {
      //Given
      const league = gameState.createLeague();

      //When
      const players = league.getPlayers();

      //Then
      //Empty array returned
      expect(typeof players).to.equal('object');
      expect(players.length).to.equal(0);

    });
    it('returns expected output for 1 player', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');

      //When
      const players = league.getPlayers();
      //Then
      expect(players[0][0]).to.equal('Player1');
      expect(players[0].length).to.equal(1);

    });
    it('returns expected output for 2 players', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      //When
      const players = league.getPlayers();
      //Then
      expect(players[0][0]).to.equal('Player1');
      expect(players[1][0]).to.equal('Player2');
      expect(players.length).to.equal(2);
    });
    it('returns expected output for 4 players', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');
      league.addPlayer('Player4');
      //When
      const players = league.getPlayers();
      //Then
      expect(players[0][0]).to.equal('Player1');
      expect(players[1][0]).to.equal('Player2');
      expect(players[1][1]).to.equal('Player3');
      expect(players[2][0]).to.equal('Player4');
      expect(players.length).to.equal(3);
    });
    it('returns expected output for 7 players', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');
      league.addPlayer('Player4');
      league.addPlayer('Player5');
      league.addPlayer('Player6');
      league.addPlayer('Player7');
      //When
      const players = league.getPlayers();
      //Then
      expect(players[0][0]).to.equal('Player1');
      expect(players[1][0]).to.equal('Player2');
      expect(players[1][1]).to.equal('Player3');
      expect(players[2][0]).to.equal('Player4');
      expect(players[2][1]).to.equal('Player5');
      expect(players[2][2]).to.equal('Player6');
      expect(players[3][0]).to.equal('Player7');
      expect(players.length).to.equal(4);
    });
  });

  describe('#recordWin', function () {
    it('swaps players positions when player beats player in row above', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');
      //order of addition places Player 1 in top row, 2 and 3 in second etc.
      const winner = 'Player2';
      const loser = 'Player1';
      //When
      league.recordWin(winner, loser);
      const places = league.getPlayers();

      //Then
      expect(places[0][0]).to.equal('Player2');
      expect(places[1][0]).to.equal('Player1');
    });

    it('throws error when winner is from higher row', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');

      let winner = 'Player1';
      let loser = 'Player2';

      //When
      const match = function (){
        league.recordWin(winner, loser);
      };

      //Then
      expect(match).to.throw(`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`);
    });

    it('throws error when the winner is from >1 row position below the loser', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');
      league.addPlayer('Player4');

      let winner = 'Player4';
      let loser = 'Player1';

      //When
      const match = function (){
        league.recordWin(winner, loser);
      };

      //Then
      expect(match).to.throw(`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`);
    });

    it('throws error when the winner and loser are from the same row', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');

      let winner = 'Player2';
      let loser = 'Player3';

      //When
      const match = function (){
        league.recordWin(winner, loser);
      };

      //Then
      expect(match).to.throw(`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`);
    });

    it('throws error when the winner doesn\'t exist', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      let winner = 'Player999';
      let loser = 'Player3';
      //When
      const match = function (){
        league.recordWin(winner, loser);
      };
      //Then
      expect(match).to.throw(`Player '${winner}' is not in the game`);
    });

    it('throws error when the loser doesn\'t exist', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      let winner = 'Player2';
      let loser = 'Player999';
      //When
      const match = function (){
        league.recordWin(winner, loser);
      };
      //Then
      expect(match).to.throw(`Player '${loser}' is not in the game`);
    });
  });

  describe('#getWinner', function () {
    it('gets the player at the top of the pyramid', function () {
      //Given
      const league = gameState.createLeague();
      league.addPlayer('Player1');
      league.addPlayer('Player2');
      league.addPlayer('Player3');

      const winner = 'Player3';
      const loser = 'Player1';

      //When
      const topOfLeagueBefore = league.getWinner();
      league.recordWin(winner, loser);
      const topOfLeagueAfter = league.getWinner();

      //Then
      expect(topOfLeagueBefore).to.equal('Player1');
      expect(topOfLeagueAfter).to.equal('Player3');
    });
    it('returns null when no players in league', function () {
      //Given
      const league = gameState.createLeague();

      //When
      const winner = league.getWinner();

      //Then
      expect(winner).to.equal(null);
    });
  });
});
