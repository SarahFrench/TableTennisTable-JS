Feature: Run a table tennis league

  Scenario: empty league
    Given the league has no players
    When I print the league
    Then I should see that there are no players

    Given the league has no players
    When I print the winner
    Then I should see nothing is returned

  Scenario: league that contains two players puts them in the right position
    Given that I add player "Player1"
    Given that I add player "Player2"
    When I print the league
    Then I should see that there are 2 players
    Then I should see "Player1" in position 1
    Then I should see "Player2" in position 2
    Then I should not see anyone in position 3

  Scenario: league that contains two players records a legitimate win
    Given that I add player "Player1"
    Given that I add player "Player2"
    When I record "Player2" winning against "Player1"
    When I print the league
    Then I should see "Player2" in position 1
    Then I should see "Player1" in position 2

  Scenario: league that contains two players does not record an illegitimate win
    Given that I add player "Player1"
    Given that I add player "Player2"
    When I record "Player1" winning against "Player2"
    Then I should see "Player1" and "Player2" have not swapped places

  Scenario: league that contains three players puts them in the right order
    Given that I add player "Player1"
    Given that I add player "Player2"
    Given that I add player "Player3"
    When I print the league
    Then I should see that there are 3 players
    Then I should see "Player1" in position 1
    Then I should see "Player2" in position 2
    Then I should see "Player3" in position 3

  Scenario: league that contains three players records a legitimate win
    Given that I add player "Player1"
    Given that I add player "Player2"
    Given that I add player "Player3"
    When I record "Player3" winning against "Player1"
    When I print the league
    Then I should see "Player3" in position 1
    Then I should see "Player1" in position 3
