'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /pets', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of pets."', function() {
            var response = request('get', 'http://localhost:8080/pets', { 
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
            expect(response).to.have.schema({"type":"array","items":{"type":"object","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}}}});
            return chakram.wait();
        });    
    });
});