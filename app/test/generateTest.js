var oatts = require('oatts');

var options = {
    // see "Options" section below for available options
    "spec": "./openAPI/industrialcodes_2.0.yaml",
    "customValuesFile": "./test/customValues.json",
    "writeTo": "./test"
};

var tests = oatts.generate('./openAPI/industrialcodes_2.0.yaml', options);

console.log(tests)
