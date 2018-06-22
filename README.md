# Example API
An attempt at an reference API-implementation that comply to the following set of requirements:
- user requirements
- a set of quality requirements

The requirements are documented as features (gherkin) in the feature folder.

An OpenAPI-specification is made based on the features

Finally, most of the tests are generated from the openAPI-specifcation, while others will be handcoded based on operational features from quality-requirements. Tests are found in the app/test-folder.

The app folder contains an example implementation of an API that should pass all of the tests.

<img src='https://g.gravizo.com/svg?
  digraph G {
  Usecase -> Feature;
  Quality -> Feature;
  Feature -> OpenAPI;
  Feature -> Test;
  OpenAPI -> Test;
  Test -> API [label=" BDD-style"];
  }
'/>
