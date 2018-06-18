const { should } = require('chai').should();
const { expect } = require('chai').expect;

request = require('supertest');
api = require('../server');

describe('/pets', function() {
  it('should return a 200 response', function(done) {
    request(api)
    .get('/pets')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
  it('should return a valid JSON body', function(done) {
    request(api)
    .get('/pets')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      res.body.should.not.be.null;
      //TODO add more requirements to body
      done();
    });
  });
  describe('/pets/:id', function() {
    it('should return a 200 response');
  });
});
