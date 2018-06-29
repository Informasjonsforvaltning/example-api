'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /pets/{petId}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A pets with the given id."', function() {
            var response = request('get', 'http://localhost:8080/pets/1', { 
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
            expect(response).to.have.schema({"type":"object","items":{"type":"object","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}}}});
            return chakram.wait();
        });    
    });
});