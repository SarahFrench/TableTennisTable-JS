const chai = require('chai');
const expect = chai.expect;

const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');

describe('leagueRenderer', function () {
  describe('rendering a single name', function () {
    it('states that the league is empty', function () {
      const league = gameState.createLeague();
      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal('No players yet');
    });

    it('renders a single player', function () {
      const league = gameState.createLeague();
      league.addPlayer('Bob');
      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal(
`-------------------
|       Bob       |
-------------------`);
    });

    it('renders a player with a longish name', function () {
      const league = gameState.createLeague();
      league.addPlayer('Lizzie_Bennett');
      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal(
`-------------------
| Lizzie_Bennett  |
-------------------`);
    });

    it('truncates a very long name name', function () {
      const league = gameState.createLeague();
      league.addPlayer('Lady_Catherine_de_Bourgh');
      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal(
`-------------------
|Lady_Catherine...|
-------------------`);
    });
  });

  describe('rendering a pyramid', function () {
    it('renders multiple players', function () {
      const league = gameState.createLeague();
      league.addPlayer('Helen');
      league.addPlayer('Dave');
      league.addPlayer('Mell');
      league.addPlayer('Artie');
      league.addPlayer('Caliban');
      league.addPlayer('Lupin');

      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal(
`                    -------------------
                    |      Helen      |
                    -------------------
          ------------------- -------------------
          |      Dave       | |      Mell       |
          ------------------- -------------------
------------------- ------------------- -------------------
|      Artie      | |     Caliban     | |      Lupin      |
------------------- ------------------- -------------------`
      );
    });

    it('renders empty boxes for missing players in row', function () {
      const league = gameState.createLeague();
      league.addPlayer('Helen');
      league.addPlayer('Dave');
      league.addPlayer('Mell');
      league.addPlayer('Artie');

      const rendered = leagueRenderer.render(league);
      expect(rendered).to.equal(
`                    -------------------
                    |      Helen      |
                    -------------------
          ------------------- -------------------
          |      Dave       | |      Mell       |
          ------------------- -------------------
------------------- ------------------- -------------------
|      Artie      | |                 | |                 |
------------------- ------------------- -------------------`
      );
    });
  });
});
