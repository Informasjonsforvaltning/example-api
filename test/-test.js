'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

describe('tests for /', function() {
    describe('tests for get', function() {
        it('should respond 200 for "A list of industrial codes."', function() {
            var response = request('get', 'http://localhost:8080/api/industrialcodes/', { 
                'headers': {"Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200);
            expect(response).to.have.schema({"items":{"properties":{"description":{"example":"Dyrking av ris","type":"string"},"id":{"example":1,"type":"number"},"industrialcode":{"example":"01.120","type":"string"}},"required":["id","industrialcode","description"],"type":"object"},"type":"array"});
            return chakram.wait();
        });
    
    });
    
    describe('tests for post', function() {
        it('should respond 201 for "Created"', function() {
            var response = request('post', 'http://localhost:8080/api/industrialcodes/', { 
                'body': {"industrialcode":"veniam id aliqua consequat","description":"exercitation non eu dolor"},
                'headers': {"Content-Type":"application/json"},
                'time': true
            });

            expect(response).to.have.status(201);
            return chakram.wait();
        });
    
    });
});