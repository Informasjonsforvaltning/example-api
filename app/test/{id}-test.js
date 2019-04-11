'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /{id}', function() {
    describe('tests for get', function() {
        it('should respond 200 for "An industrial code with the given id."', function() {
            var response = request('get', 'http://localhost:8080/api/industrialcodes/1', {
                'headers': {"Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200);
            expect(response).to.have.schema({"items":{"properties":{"description":{"example":"Dyrking av ris","type":"string"},"id":{"example":1,"type":"number"},"industrialcode":{"example":"01.120","type":"string"}},"required":["id","industrialcode","description"],"type":"object"},"type":"object"});
            return chakram.wait();
        });

    });

    describe('tests for put', function() {
        it('should respond 204 for "Updated"', function() {
            var response = request('put', 'http://localhost:8080/api/industrialcodes/1', {
                'body': {"industrialcode":"ex non","description":"aliqua nostrud culpa"},
                'headers': {"Content-Type":"application/json"},
                'time': true
            });

            expect(response).to.have.status(204);
            return chakram.wait();
        });

    });
    
    describe('tests for delete', function() {
        it('should respond 204 for "industrial code deleted"', function() {
            var response = request('delete', 'http://localhost:8080/api/industrialcodes/1', {
                'time': true
            });

            expect(response).to.have.status(204);
            return chakram.wait();
        });

    });

});
