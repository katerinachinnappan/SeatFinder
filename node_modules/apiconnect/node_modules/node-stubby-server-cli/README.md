# node-stubby-server-cli
Module which exposes the Stubby Server API interface from node. The API is clean and simple to use. Note that if you
mute() the client, you cannot get any events so it's NOT recommended to do this.

We also use ES6 weakmaps to make certain properties private, however, a polyfill is included in the event your
application isn't ES6 ready. Please fork and enhance or file a bug ticket if you notice any issues

### ES6
```bash
node --harmony <script>.js
```

### < ES6
```bash
node <script>.js
```

## Installation
Install [this module](https://www.npmjs.com/package/node-stubby-server-cli) via npm

```bash
npm -i node-stubby-server-cli
```

## Example usage
```javascript
var cli = new CLI();

cli.admin(8001)
  .stubs(8000)
  .tls(8002)
  .help() // prints the help... note you still chain
  .mute() // supress output
  .data(__dirname + '/data.yml')
  .unmute() // enable output
  .start()
  .on(cli.events.REQUEST, function(data) {
    console.log(data);
  }).on(cli.events.RESPONSE, function(data) {
    console.log(data);
  });

  // server should be running after this...
  cli.once('LISTENING', function() {
     next();
  })
   .on(Events.REQUEST, function(payload) {
    // do something
   })
   .on(Events.DISCONNECTED, function() {
     // do something
   })
   .on(Events.LOADED_ROUTE, function(data) {
    // do something
   })

  // note events won't be dispatch if muted
```

## Example data file (routes)
```javascript
 [{
   "request": {
     "url": "^/my-api/",
     "method": "GET",
     "body": "Hello World"
   },
   "response": {
     "status": 200,
     "headers": {
       "Content-Type": "application/json"
     },
     "file": "data.json"
   }
 }]
```

## Gulp.js Example
```javascript
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var StubbyCLI = require('node-stubby-server-cli');
var Events = stubbyCLI.Events;

gulp.task('start:stubby', function(next) {
  var cli = new StubbyCLI.CLI();
  cli.admin(<admin port>)
    .stubs(<stubs port>)
    .tls(<tls port>)
    .data(<path to data file>)
    .unmute()

  cli.once('LISTENING', function() {
    next();
  }).start();
});

gulp.task('test', ['start:stubby'], function() {
  // run your tests after the stub server starts
});

gulp.task('stop:stubby', ['test'], function(next) {
  cli.kill();
  next();
});

// Default tasks to run
gulp.task('default', [
  'start:stubby',
  'test',
  'stop:stubby'
]);
```

### Event.REQUEST Payload
```json
{ 
  "time": "10:27:25",
  "method": "GET",
  "location": "stubs",
  "path": "/hello"
}
```

### Event.RESPONSE Payload
```json
{
  "time": "09:26:47",
  "statusCode": "404",
  "location": "stubs",
  "path": "/your/awesome/endpoint",
  "message": "is not a registered endpoint"
}
```
### Test
```bash
npm test
```