/********************************************************* {COPYRIGHT-TOP} ***
 * Licensed Materials - Property of IBM
 * 5725-Z22, 5725-Z63, 5725-U33, 5725-Z63
 *
 * (C) Copyright IBM Corporation 2016, 2017
 *
 * All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 ********************************************************** {COPYRIGHT-END} **/
// Node module: apiconnect

var fs = require('fs');

// getConfigDir is intended to be created without the use of additional module
// like user-home.  This code will be executed during uninstall.  Node modules will
// be removed when the code is executed
function getConfigDir(createDir) {
  if (typeof createDir === 'undefined') {
    createDir = true;
  }
  var os = require('os');
  var path = require('path');
  var env = process.env;
  var home = env.HOME;
  var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
  var homedir;
  if (process.platform === 'win32') {
    homedir = env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
  }
  if (process.platform === 'darwin') {
    homedir = home || (user ? '/Users/' + user : null);
  }
  if (process.platform === 'linux') {
    homedir = home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
  }
  var userDir = typeof os.homedir === 'function' ? os.homedir() : homedir;
  process.env.APIC_CLI_CONFIG_DIR = process.env.APIC_CLI_CONFIG_DIR || '.apiconnect';
  var configDir = process.env.APIC_CONFIG_PATH || path.resolve(userDir, process.env.APIC_CLI_CONFIG_DIR);
  if (createDir) {
    var mkdirp = require('mkdirp');
    mkdirp.sync(configDir);
  }
  return configDir;
}
exports.getConfigDir = getConfigDir;

function rmdir(p) {
  var files = [];
  fs.accessSync(p, fs.F_OK);
  files = fs.readdirSync(p);
  files.forEach(function(file, index) {
    var cp = p + '/' + file;
    if (fs.lstatSync(cp).isDirectory()) {
      rmdir(cp);
    } else {
      fs.unlinkSync(cp);
    }
  });
  fs.rmdirSync(p);
}
exports.rmdir = rmdir;

