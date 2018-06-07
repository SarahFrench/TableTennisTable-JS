const chai = require('chai');
const expect = chai.expect;

const gameState = require('../src/league');
const InvalidArgumentException = require('../src/invalid_argument_exception');

describe('league', function () {
  describe('#addPlayer', function () {
    it('adds a player to the game', function () {
      const league = gameState.createLeague();
      league.addPlayer('Bob');

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(1);
      expect(players[0]).to.have.members(['Bob']);
    });

    it('adds a second player to the second row', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Ben');

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(2);

      expect(players[0]).to.have.members(['Anna']);
      expect(players[1]).to.have.members(['Ben']);
    });

    it('builds a pyramid with subsequent players', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Ben');
      league.addPlayer('Camille');

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(2);
      expect(players[0]).to.have.members(['Anna']);
      expect(players[1]).to.have.members(['Ben', 'Camille']);
    });

    it('rejects a duplicate player', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Ben');
      league.addPlayer('Camille');

      expect(() => league.addPlayer('Ben')).to.throw(InvalidArgumentException);

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(2);
      expect(players[0]).to.have.members(['Anna']);
      expect(players[1]).to.have.members(['Ben', 'Camille']);
    });

    it('rejects a player with spaces in their name', function () {
      const league = gameState.createLeague();

      expect(() => league.addPlayer('A name with spaces')).to.throw(InvalidArgumentException);
    });
  });

  describe('#recordWin', function () {
    it('swaps winning and losing players', function () {
      const league = gameState.createLeague();
      league.addPlayer('OriginalWinner');
      league.addPlayer('SomeOtherPlayer');
      league.addPlayer('NewWinner');

      league.recordWin('NewWinner', 'OriginalWinner');

      const players = league.getPlayers();

      expect(players).to.have.lengthOf(2);

      expect(players[0]).to.have.members(['NewWinner']);
      expect(players[1]).to.have.members(['SomeOtherPlayer', 'OriginalWinner']);
    });

    it('rejects a win by the higher-level player', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Bob');

      expect(() => league.recordWin('Anna', 'Bob')).to.throw(InvalidArgumentException);

      const players = league.getPlayers();
      expect(players).to.have.lengthOf(2);

      expect(players[0]).to.have.members(['Anna']);
      expect(players[1]).to.have.members(['Bob']);
    });

    it('rejects a win by a player in the same row', function () {
      const league = gameState.createLeague();
      league.addPlayer('Aga');
      league.addPlayer('Belema');
      league.addPlayer('Coleen');

      expect(() => league.recordWin('Belema', 'Coleen')).to.throw(InvalidArgumentException);

      const players = league.getPlayers();
      expect(players).to.have.lengthOf(2);

      expect(players[0]).to.have.members(['Aga']);
      expect(players[1]).to.have.members(['Belema', 'Coleen']);
    });

    it('rejects a win by a player in a much higher row', function () {
      const league = gameState.createLeague();
      league.addPlayer('Alan');
      league.addPlayer('Brid');
      league.addPlayer('Christiana');
      league.addPlayer('Dean');

      expect(() => league.recordWin('Dean', 'Alan')).to.throw(InvalidArgumentException);

      const players = league.getPlayers();
      expect(players).to.have.lengthOf(3);

      expect(players[0]).to.have.members(['Alan']);
      expect(players[1]).to.have.members(['Brid', 'Christiana']);
      expect(players[2]).to.have.members(['Dean']);
    });

    it('rejects a win by a player not in the game', function () {
      const league = gameState.createLeague();
      league.addPlayer('Alan');
      league.addPlayer('Brid');
      league.addPlayer('Christiana');

      expect(() => league.recordWin('Dennis', 'Brid')).to.throw(InvalidArgumentException);
    });

    it('rejects a loss by a player not in the game', function () {
      const league = gameState.createLeague();
      league.addPlayer('Alan');
      league.addPlayer('Brid');
      league.addPlayer('Christiana');

      expect(() => league.recordWin('Brid', 'Dennis')).to.throw(InvalidArgumentException);
    });
  });

  describe('#getWinner', function () {
    it('returns null when there are no players', function () {
      const league = gameState.createLeague();

      expect(league.getWinner()).to.be.null;
    });

    it('is the first player added to a new game', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Ben');
      league.addPlayer('Camille');

      expect(league.getWinner()).to.equal('Anna');
    });

    it('is the new winner after a new player moves to the top', function () {
      const league = gameState.createLeague();
      league.addPlayer('Anna');
      league.addPlayer('Ben');
      league.addPlayer('Camille');

      league.recordWin('Ben', 'Anna');

      expect(league.getWinner()).to.equal('Ben');
    });
  });

  describe('#load', function () {
    it('loads a league', function () {
      const players = [
        ['Ana'],
        ['Bob', 'Celia'],
        ['Dale', 'Elspeth']
      ];
      const league = gameState.load(players);

      expect(league.getPlayers()).to.eql(players);
    });

    it('rejects an invalid league', function () {
      const invalidPlayers = [['Alasdair', 'Becky']];

      expect(() => gameState.load(invalidPlayers)).to.throw(InvalidArgumentException);
    });
  });
});
