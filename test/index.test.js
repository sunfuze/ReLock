/**
 * Created by sunfuze on 15-4-1.
 */
'use strict';
var redis = require('redis');
var should = require('should');
var Relock = require('..');

var config = {
  port: 6379,
  host: '127.0.0.1'
};

var client1 = redis.createClient(config.port, config.host);
var client2 = redis.createClient(config.port, config.host);


describe('lock', function () {
  it('get lcok', function (done) {
    var resource = "test_resource_lock";
    var ttl = 3000;

    Relock
      .lock(resource, ttl, client1)
      .then(function (res) {
        ({result: res}).result.should.not.equal(false);
        done();
      })
      .catch(function(err) {
        console.error(err.message, err.stack);
      })
  })
});

describe('unlock', function () {
  it('should be true', function (done) {
    var resource = 'test_resource_unlock';
    var ttl = 3000;
    Relock
      .lock(resource, ttl, client1)
      .then(function (res) {
        return Relock.unlock(resource, res, client1)
      })
      .then(function (res) {
        ({res: res}).res.should.not.equal(false);
        done();
      })
      .catch(function(err) {
        console.error(err.message, err.stack);
      })
  })
});

describe('mutex lock', function() {
  it('the lock must be mutex', function (done) {
    var resource = 'test_resource_mutex';
    var ttl = 3000;
    Relock
      .lock(resource, ttl, client1)
      .then(function () {
        return Relock.lock(resource, ttl, client2)
      })
      .then(function (res) {
        ({res: res}).res.should.equal(false);
        done();
      })
      .catch(function(err) {
        console.error(err.message, err.stack);
      })
  })
});

describe('mutex unlock', function() {
  it('the lock must be mutex', function (done) {
    var resource = 'test_resource_mutex';
    var ttl = 500;
    Relock
      .lock(resource, ttl, client1)
      .then(function (value) {

        setTimeout(function() {
          Relock
            .lock(resource, ttl, client2)
            .then(function() {
              return Relock
                .unlock(resource, value, client1)
                .then(function(res) {
                  ({result: res}).result.should.equal(false);
                  done();
                })
            })
            .catch(function(err) {
              console.error(err.message, err.stack);
            })
        })
      }, 800)

  })
})
