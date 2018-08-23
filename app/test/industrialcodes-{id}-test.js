'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /industrialcodes/{id}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An industrial code with the given id."', function() {
            var response = request('get', 'http://localhost:8080/industrialcodes/1', { 
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
            expect(response).to.have.schema({"type":"object","items":{"type":"object","required":["id","industrialcode","description"],"properties":{"id":{"type":"integer","format":"int64"},"industrialcode":{"type":"string"},"description":{"type":"string"}}}});
            return chakram.wait();
        });    
    });
    
    describe('tests for put', function() {
        it('should respond 204 for "Updated"', function() {
            var response = request('put', 'http://localhost:8080/industrialcodes/1', { 
                'body': {"industrialcode":"ea reprehenderit","description":"mollit"},
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(204)
            return chakram.wait();
        });    
    });
    
    describe('tests for delete', function() {
        it('should respond 204 for "industrial code deleted"', function() {
            var response = request('delete', 'http://localhost:8080/industrialcodes/1', { 
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(204)
            return chakram.wait();
        });    
    });
});