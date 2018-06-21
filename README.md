# Example API
An attempt at an reference API-implementation that comply to the following set of requirements:
- an OpenAPI v3 specification
- a set of quality requirements

Together these requirements are expressed as operational test scenarios in a BDD-like approach. The requirements are documented as features (gherkin) in the feature folder.

Finally the app folder contains an example implementation of an API that will pass all of the tests.

<img src='https://g.gravizo.com/svg?
  digraph G {
  Quality -> OpenAPI;
  OpenAPI -> Tests;
  Quality -> Tests;
  Tests -> API [label=" BDD-style"];
  }
'/>
