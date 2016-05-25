/*
 * Bedrock messages-client-http module.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* jshint node: true */

'use strict';

var bedrock = require('bedrock');
var config = bedrock.config;
var brMessagesClient = require('bedrock-messages-client');
var validate = require('bedrock-validation').validate;

require('bedrock-express');

var brPassport = require('bedrock-passport');
var ensureAuthenticated = brPassport.ensureAuthenticated;
var optionallyAuthenticated = brPassport.optionallyAuthenticated;

require('./config');

// TODO: Add logging info
var logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  var basePath = config['messages-client-http'].basePath;
  // Get ALL clients.
  app.get(basePath, ensureAuthenticated, function(req, res, next) {
      brMessagesClient.getAll(req.user.identity, {}, function(err, clients) {
        if(err) {
          return next(err);
        }
        res.json(clients);
      });
    });

  // The restart-job endpoint is operating on the premise that there can only
  // be one client polling on an endpoint
  /**
   * Restarts message clients on the specified endpoint with
   * the specified interval.
   *
   * @param interval the number of minutes to wait between polling
   * the endpoint (e.g. 1, 5, or 10)
   * @param endpoints array of endpoints for clients to be restarted
   */
  app.post(basePath,
    ensureAuthenticated,
    validate('client.bedrock-messages-client.client'),
    function(req, res, next) {
      var client = req.body;
      brMessagesClient.update(req.user.identity, client, function(err) {
        if(err) {
          return next(err);
        }
        res.status(200);
        res.send();
      });
    });
});
