Feature: Pet list
  In order to get information about pets
  As a service-consumer (client)
  I want to get a list of pets

  Scenario: list pets
  When the client requests GET /pets
  Then the response should be JSON
