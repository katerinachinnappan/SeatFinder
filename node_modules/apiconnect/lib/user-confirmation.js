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
var format = require('util').format;
var inquirer = require('inquirer');
var g = require('strong-globalize')();
var path = require('path');

function userConfirmed() {
  return new Promise(function(resolve, reject) {
    if (_.indexOf(process.argv, '--accept-license') !== -1) {
      return resolve();
    }

    var licFile = path.resolve(__dirname, path.join('..', 'LICENSE.txt'));
    inquirer.prompt([ {
      type: 'list',
      name: 'licenseAccepted',
      message: g.f('Please review the license for API Connect available' +
      ' in %s and select yes to accept.', licFile),
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
      if (answers.licenseAccepted) {
        return resolve();
      } else {
        return reject();
      }
    });
  });
}
module.exports = userConfirmed;

