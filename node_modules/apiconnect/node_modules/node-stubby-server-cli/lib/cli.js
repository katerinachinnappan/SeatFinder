'use strict';

var events = require('events');
var util = require('util');
var spawn = require('child_process').spawn;
var regexp = /(\d+:\d+:\d+)\s?([^\s]+)\s?([^\s]+)\s?\[([^\]]+)\]([^\s]+)\s?(.*)/;
var _private = new require(__dirname + '/private')();

var BufferStream = require('bufferstream')
var Events = require(__dirname + '/events');
var TRIM = /\u001b\[.*?m/;
var http = require('http');

var CLI = function (config) {
    if (!(this instanceof CLI)) {
      return new CLI(config);
    }

    _private(this).__retries = 0;
    _private(this).__maxRetries = 5;
    _private(this).__proc = null;
    _private(this).__config = config || {};
    _private(this).__routes = [];
  };

  util.inherits(CLI, events.EventEmitter);

  var _objToArray = function (obj) {
    var args = [];
    var config = _private(this).__config;
    for (var i in config) {
      var cur = config[i];
      cur = cur.split(' ');
      args = args.concat(cur);
    }

    return args;
  };

  var _onResponse = function onResponse(line) {
    var res = regexp.exec(line);
    if (res && res.length === 7) {
      res.splice(0, 1);
      res.splice(1, 1);
      var obj = {
        time: res[0]
        , statusCode: res[1]
        , location: res[2]
        , path: res[3]
        , message: res[4].replace(TRIM, "")
      };

      this.emit(Events.REQUEST, obj);
    }
  };

  var _onRequest = function onRequest(line) {
    var res = regexp.exec(line);
    if (res && res.length === 7) {
      res.splice(0, 1);
      res.splice(1, 1);
      var obj = {
        time: res[0]
        , method: res[1]
        , location: res[2]
        , path: res[3].replace(TRIM, "")
      };

      this.emit(Events.REQUEST, obj);
    }
  };

var _testConnection = function onTestConnection() {

    var self = this;
    var port = _private(this).__config.stubs.split(' ')[1];
    var url = 'http://localhost:' + port;

    return http.get(url, function (res) {
      _private(self).__isConnected = true;
      self.emit(Events.LISTENING);

      var routes = _private(self).__routes;
      while(routes.length > 0) {
        self.emit(Events.LOADED_ROUTE, routes.shift());
      }
    }).on('error', function(e) {
      if (_private(self).__retries++ > _private(self).__maxRetries) {
        self.kill();
        return self.emit(new Error('Bind Error'));
      }

      setTimeout(function onTimeout() {
        _testConnection.call(self);
      }, 100);
    });
  }

  var _spawn = function () {

    var self = this;
    var args = _objToArray.call(this);
    var _process = _private(this).__proc = spawn('stubby', args);
    var stream = _private(this).__stream = new BufferStream({encoding: 'utf8', size: 'flexible'});

    stream.split('\n');

    stream.on('split', function (chunk) {
      var line = chunk.toString().replace(TRIM, "");

      if (line.indexOf('<-') !== -1) {
        if (!_private(self).__isConnected) {
          return;
        }
        _onResponse.call(self, line);
      } else if (line.indexOf('-->') !== -1) {
        if (!_private(self).__isConnected) {
          return;
        }
        _onRequest.call(self, line);
      } else if (/^Loaded:/.test(line)) {
        var parts = line.split(' ');
        if (parts.length === 3) {
          if (!_private(self).__isConnected) {
            _private(self).__routes.push(parts[2].replace(TRIM, ""));
            _testConnection.call(self);
          } else {
            self.emit(events.LOADED_ROUTE, parts[2].replace(TRIM, ""));
          }
        }
      }
    });

    _process.stdout.pipe(stream);
    _process.stderr.pipe(stream);
    _process.on('close', function (code) {
      self.emit(Events.DISCONNECTED);
    });

    return this;
  };

  CLI.prototype.admin = function (port) {
    _private(this).__config.admin = '--admin ' + port;
    return this;
  };

  CLI.prototype.stubs = function (port) {
    _private(this).__config.stubs = '--stubs ' + port;
    return this;
  };

  CLI.prototype.tls = function (port) {
    _private(this).__config.tls = '--tls ' + port;
    return this;
  };

  CLI.prototype.data = function (data) {
    _private(this).__config.data = '--data ' + data;
    return this;
  };

  CLI.prototype.cert = function (cert) {
    var config = _private(this).__config;
    config.cert = '--cert ' + cert;
    if (!config.key) {
      config.__validateSSL = true;
    } else if (config.__validateSSL) {
      delete config.__validateSSL;
    }

    return this;
  };

  CLI.prototype.key = function (key) {
    var config = _private(this).__config;
    config.key = '--key ' + key;
    if (!config.cert) {
      config.__validateSSL = true;
    } else if (config.__validateSSL) {
      delete config.__validateSSL;
    }

    return this;
  };

  CLI.prototype.location = function (location) {
    _private(this).__config.location = '--location ' + location;
    return this;
  };

  CLI.prototype.watch = function () {
    _private(this).__config.watch = '--watch';
    return this;
  };

  /**
   * Disables sending data to STDOUT and
   * STDERR. Note that when disabled, you
   * will be unable to bind to events.
   *
   * @returns {CLI}
   */
  CLI.prototype.mute = function () {
    _private(this).__config.mute = '--mute';
    return this;
  };

  /**
   * Unmute Stubby and pipe information
   * to STDOUT and STDERR. Note that
   * the process needs to be unmuted in
   * order to bind to events.
   *
   * @returns {CLI}
   */
  CLI.prototype.unmute = function () {
    if (_private(this).__config.mute) {
      delete _private(this).__config.mute;
    }

    return this;
  };

  /**
   * Prints the Stubby CLI help information
   * @returns {CLI}
   */
  CLI.prototype.help = function () {
    var _tmp = _private(this).__config;
    _private(this).__config = {help: '--help'};
    _private(this).__spawn();
    return new CLI(_tmp);
  };

  /**
   * Terminates a running stubby server
   * process.
   */
  CLI.prototype.kill = function () {
    _private(this).__proc.kill('SIGTERM');
  };

  /**
   * Start a new Stubby Server
   * @returns {CLI}
   */
  CLI.prototype.start = function () {
    if (_private(this).__config.__validateSSL) {
      if (!_private(this).__config.key) {
        throw new Error('Missing key: --key <key>');
      }

      if (!_private(this).__config.cert) {
        throw new Error('Missing certificate: --cert <cert>')
      }

      if (_private(this).__config.pfx) {
        delete _private(this).__config.pfx;
      }
    }

    _spawn.call(this);

    return this;
  };

  module.exports = CLI;
