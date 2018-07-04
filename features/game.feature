Feature: Run a table tennis league

  Scenario: empty league
    Given the league has no players
    When I print the league
    Then I should see that there are no players

  Scenario: adding players
    Given the league has players:
      | Alice   |
      | Bob     |
      | Charles |
      | Dana    |
    When I print the league
    Then I should see "Alice" in row 1
    And I should see "Bob" in row 2
    And I should see "Charles" in row 2
    And I should see "Dana" in row 3

  Scenario: find the winner
    Given the league has players:
      | Alice   |
      | Bob     |
      | Charles |
      | Dana    |
    When I check the winner
    Then I should see that "Alice" is the winner

  Scenario: record a win
    Given the league has players:
      | Alice   |
      | Bob     |
      | Charles |
    When "Charles" wins a match against "Alice"
    And I print the league
    Then I should see "Charles" in row 1
    And I should see "Alice" in row 2

  Scenario: record a win between players on non-adjacent rungs
    Given the league has players:
      | Alice   |
      | Bob     |
      | Charles |
      | Dana    |
    When "Dana" wins a match against "Alice"
    And I print the league
    Then I should see "Alice" in row 1
    And I should see "Dana" in row 3

  Scenario: save a game
    Given the league has players:
      | Alice   |
      | Bob     |
      | Charles |
      | Dana    |
    When I save the game to "saved_game.json"
    And I start a new game
    And I load the game from "saved_game.json"
    And I print the league
    Then I should see "Alice" in row 1
    And I should see "Bob" in row 2
    And I should see "Charles" in row 2
    And I should see "Dana" in row 3
