# ReLock
simple distributed lock base on redis

## API
```js
  
  var resource = "resource_lock";
  var client = require('redis').createClient(port, host);
  
  var lock;
  Relock
    .lock(resource, ttl, client)
    .then(function(key) {
      lock = key;
       ...
    })
  
  Relock
    .unlock(resource, lock, client)
    .then(function(result) {
      ...
    })
```
