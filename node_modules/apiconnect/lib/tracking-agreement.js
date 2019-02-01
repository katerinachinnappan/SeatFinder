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

var Promise = require('bluebird');
var _ = require('lodash');
var apicConfig = require('apiconnect-config');
var format = require('util').format;
var g = require('strong-globalize')();
var inquirer = require('inquirer');
var logger = require('apiconnect-cli-logger');
var path = require('path');
var agreementFile = path.resolve(__dirname, '../ANALYTICS.txt');

function tracking() {
  return new Promise(function(resolve, reject) {
    var config = apicConfig.loadConfig();
    if (config.getOne('enable-analytics', apicConfig.USER_STORE) !== undefined) {
      logger.debug('skipping prompt. enable-analytics value is set in config');
      return resolve();
    }

    var acceptAnalyticsIdx = _.indexOf(process.argv, '--enable-analytics');
    if (acceptAnalyticsIdx !== -1) {
      logger.debug('skipping prompt. enable-analytics passed in via CLI option');
      process.argv.splice(acceptAnalyticsIdx, 1);
      config.set({ 'enable-analytics': true }, apicConfig.USER_STORE);
      return resolve();
    }

    var disableAnalyticsIdx = _.indexOf(process.argv, '--disable-analytics');
    if (disableAnalyticsIdx !== -1) {
      logger.debug('skipping prompt. disable-analytics passed in via CLI option');
      process.argv.splice(disableAnalyticsIdx, 1);
      config.set({ 'enable-analytics': false }, apicConfig.USER_STORE);
      return resolve();
    }

    logger.debug('prompting for analytics');
    var licFile = path.resolve(__dirname, agreementFile);
    inquirer.prompt([ {
      type: 'list',
      name: 'licenseAccepted',
      message: g.f(
        'Please review the analytics agreement for API Connect available in %s and select yes to accept.',
        licFile
      ),
      choices: [ {
        key: format('y'),
        name: g.f('yes'),
        value: true,
      }, {
        key: format('n'),
        name: g.f('no'),
        value: false,
      } ],
    } ], function(answers) {
      logger.debug('analytics: %j', answers.licenseAccepted);
      config.set({ 'enable-analytics': !!answers.licenseAccepted }, apicConfig.USER_STORE);
      return resolve();
    });
  });
}

module.exports = tracking;
module.exports.agreementFile = agreementFile;

