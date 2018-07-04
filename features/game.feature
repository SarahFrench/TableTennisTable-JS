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
