#!/usr/bin/env node
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
var getConfigDir = require('./util').getConfigDir;
var rmdir = require('./util').rmdir;

if (process.env.npm_config_config_clear === undefined || process.env.npm_config_config_clear === 'true') {
  try {
    var configDir = getConfigDir(false);
    var stats = fs.statSync(configDir);
    if (stats.isDirectory()) {
      rmdir(configDir);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('IBM API Connect developer toolkit was unable to remove the global configuration directory "'
        + configDir + '".');
    }
  }
}

