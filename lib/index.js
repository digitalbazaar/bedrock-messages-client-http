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

require('./config');

// TODO: Add logging info
var logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  var basePath = config['messages-client-http'].routes.basePath;
  // Get ALL clients.
  app.get(basePath, ensureAuthenticated, function(req, res, next) {
    brMessagesClient.getAll(req.user.identity, {}, function(err, clients) {
      if(err) {
        return next(err);
      }
      res.json(clients);
    });
  });

  // This endpoint is operating on the premise that there can only
  // be one client polling on an endpoint
  /**
   * Updates with the passed message client object and then restarts polling
   * with the new info.
   */
  app.post(basePath,
    ensureAuthenticated,
    validate('bedrock-messages-client-http.client'),
    function(req, res, next) {
      var client = req.body;
      brMessagesClient.update(req.user.identity, client, function(err) {
        if(err) {
          return next(err);
        }
        res.sendStatus(204);
      });
    });
});
