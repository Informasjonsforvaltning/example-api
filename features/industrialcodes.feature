Feature: Industrial code list
  In order to get information about industrial codes
  As a service-consumer (client)
  I want to get a list of industrial codes

  Scenario: List industrial codes
  When the client requests GET /industrialcode
  Then the response should be JSON
