# Tests

## Generate tests
To generate tests, do the following:
```
cd example-api/app
npm run generateTest
```
The tests will be written to the test-folder

## Run tests
To test the example API, do the following:
```
git clone https://github.com/Informasjonsforvaltning/example-api.git
cd example-api/app
npm install
npm run dev #in a dedicated shell
npm test
```

## Credits
* We use https://github.com/google/oatts to generate tests based on our openAPI specification
