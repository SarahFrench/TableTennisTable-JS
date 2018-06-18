const InvalidArgumentException = require('./invalid_argument_exception');

function buildLeague (players) {
  const rows = players;

  function addPlayer (player) {
    validateName(player);
    checkPlayerIsUnique(player);

    if (rows.length == 0 || bottomRow().isFull()) {
      addRow();
    }

    bottomRow().add(player);
  }

  function bottomRow() {
    return rows[rows.length - 1];
  }

  function addRow() {
    const newRow = leagueRow(rows.length + 1);
    rows.push(newRow);
  }

  function recordWin (winner, loser) {
    checkPlayerIsInGame(winner);
    checkPlayerIsInGame(loser);

    const winnerRowIndex = findPlayerRowIndex(winner);
    const loserRowIndex = findPlayerRowIndex(loser);

    if (winnerRowIndex - loserRowIndex != 1) {
      throw new InvalidArgumentException(`Cannot record match result. Winner '${winner}' must be one row below loser '${loser}'`);
    }

    rows[winnerRowIndex].swap(winner, loser);
    rows[loserRowIndex].swap(loser, winner);
  }

  function getWinner () {
    if (rows.length > 0) {
      return rows[0].getPlayers()[0];
    }
    return null;
  }

  function validateName(player) {
    if (!player.match(/^\w+$/)) {
      throw new InvalidArgumentException(`Player name ${player} contains invalid characters`);
    }
  }

  function findPlayerRowIndex (player) {
    return rows.findIndex(row => row.includes(player));
  }

  function isPlayerInGame (player) {
    return findPlayerRowIndex(player) >= 0;
  }

  function checkPlayerIsInGame (player) {
    if (!isPlayerInGame(player)) {
      throw new InvalidArgumentException(`Player '${player}' is not in the game`);
    }
  }

  function checkPlayerIsUnique (player) {
    if (isPlayerInGame(player)) {
      throw new InvalidArgumentException(`Cannot add player '${player}' because they are already in the game`);
    }
  }

  return {
    addPlayer: addPlayer,
    getPlayers: function () { return rows.map(row => row.getPlayers()); },
    recordWin: recordWin,
    getWinner: getWinner
  };
}

exports.createLeague = function () {
  return buildLeague([]);
};

exports.load = function (gameState) {
  validate(gameState);

  const rows = gameState.map(function (row, index) {
    return leagueRow(index + 1, row);
  });
  return buildLeague(rows);
};

function validate (gameState) {
  const bottomRowIndex = gameState.length - 1;
  gameState.forEach(function (row, index) {
    const maxLength = index + 1;
    let rowHascorrectLength;
    if (index == bottomRowIndex) {
      rowHascorrectLength = row.length <= maxLength;
    } else {
      rowHascorrectLength = row.length == maxLength;
    }

    if (!rowHascorrectLength) {
      throw new InvalidArgumentException('Invalid game state');
    }
  });
}

function leagueRow(maxSize, players = []) {
  function swap (playerToRemove, playerToAdd) {
    const playerIndex = players.findIndex(player => player === playerToRemove);
    players.splice(playerIndex, 1, playerToAdd);
  }

  return {
    getPlayers: function () { return players; },
    add: function (player) { players.push(player); },
    isFull: function () { return players.length === maxSize; },
    includes: function (player) { return players.includes(player); },
    swap: swap
  };
}
