/*
 * Bedrock messages-client-http module.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
 /* jshint node: true */

'use strict';

var async = require('async');
var bedrock = require('bedrock');
var config = bedrock.config;
var BedrockError = bedrock.util.BedrockError;
var brMessagesClient = require('bedrock-messages-client');
var request = require('request');
var scheduler = require('bedrock-jobs');
var uuid = require('node-uuid').v4;
require('bedrock-express');

require('./config');

// TODO: Add logging info
var logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  // TODO: Add authentication
  // TODO: Add validation
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
  app.post(config['messages-client-http']['settings-endpoint'],
    function(req, res, next) {
      var interval = req.body.interval;
      var endpoint = req.params.endpoint;
      var client;

      var found = config['messages-client'].clients.some(function(current) {
        if(current.endpoint === endpoint) {
          client = current;
          return true;
        }
      });

      if(!found) {
        return next(new BedrockError(
          'There is no messge client running on that endpoint.',
          'InvalidMessageClient',
          {endpoint: endpoint, httpStatusCode: 500, 'public': true}));
      }

      brMessagesClient.start(client.endpoint, interval, function(err) {
        if(err) {
          return next(new BedrockError(
            'Failed to start message client.',
            'MessageClientFailure',
            {endpoint: endpoint, httpStatusCode: 500, 'public': true}));
        }
        res.status(200);
        res.send();
      });
    });
});
