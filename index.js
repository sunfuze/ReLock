/**
 * Created by sunfuze on 15-4-1.
 */
'use strict';
if(!global.Promise) {
  global.Promise = require('bluebird');
}

var crypto = require('crypto');
var debug = require('debug')('Relock');
module.exports = {

  /**
   * lock
   * @param resource resource to lock
   * @param ttl time to live
   * @param client redis client
   * @return {Promise} lock result
   */
  lock: function(resource, ttl, client) {

    var value = randomValue();
    return new Promise(function(onResolve, onReject) {
      client.eval(lockScript, 1, resource, value, ttl, function(err, res) {
        if(err) {
          onReject(err);
        } else {
          if(!res) {
            onResolve(false);
          } else {
            debug('lock result:%s', res);
            onResolve(value);
          }
        }
      })
    })
  },
  /**
   * unlock, del the lock
   * @param resource resource to unlock
   * @param value the key of lock
   * @param client
   */
  unlock: function(resource, value, client) {
    return new Promise(function(onResolve, onReject) {
      client.eval(unLockScript, 1, resource, value, function(err, res) {
        debug('unlock result:%s', res);
        if(err) {
          onReject(err);
        } else if(res) {
          onResolve(res);
        } else {
          onResolve(false);
        }
      })
    })
  }
};

var lockScript = `

  return redis.call("set", KEYS[1], ARGV[1], "NX", "PX", ARGV[2])
`;

var unLockScript = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  end
  return false
`;

function randomValue() {
  try {
    var buf = crypto.randomBytes(16);
    return buf.toString('hex');
  } catch(err) {
    console.error('create random bytes raise an error[%s], stack: %j', err.message, err.stack);
    throw err;
  }
}

