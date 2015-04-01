# ReLock
simple distributed lock base on redis

## API
```js
  
  var key = "lock";
  var client = require('redis').createClient(port, host);
  
  var lock;
  Relock
    .lock(resource, ttl, client)
    .then(function(key) {
       ...
    })
  
  Relock
    .unlock(resource, key, client)
    .then(function(result) {
      ...
    })
```