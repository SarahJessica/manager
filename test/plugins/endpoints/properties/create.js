/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should create a property', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'Oak Ridge', address: '4 Cheap Street'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Oak Ridge');
      expect(response.result.address).to.equal('4 Cheap Street');
      expect(response.result.createdAt).to.be.instanceof(Date);
      expect(response.result.__v).to.be.a('number');
      expect(response.result.managerId.toString()).have.length(24);
      expect(response.result.managerId.toString()).to.equal('a00000000000000000000001');
      done();
    });
  });
  it('should not create a property based on an extra char in userId', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a000000000000000000000001'}, payload: {name: 'Oak Ridge', address: '4 Cheap Street'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Oak Ridge');
      expect(response.result.address).to.equal('4 Cheap Street');
      expect(response.result.createdAt).to.be.instanceof(Date);
      expect(response.result.__v).to.not.be.a('number');
      done();
    });
  });
  // it('should not create a property based on an extra char in userId', function(done){
  //   server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a000000000000000000000001'}, payload: {name: 'Oak Ridge', address: '4 Cheap Street'}}, function(response){
  //     expect(response.statusCode).to.equal(200);
  //     expect(response.result.name).to.equal('Oak Ridge');
  //     expect(response.result.address).to.equal('4 Cheap Street');
  //     expect(response.result.createdAt).to.be.instanceof(Date);
  //     expect(response.result.__v).to.not.be.a('number');
  //     expect(response.result.managerId.toString()).not.have.length(24);
  //     expect(response.result.managerId.toString()).to.not.equal('a00000000000000000000001');
  //     done();
  //   });
  // });
});
