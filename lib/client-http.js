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
var brMessages = require('bedrock-messages');
var brMessages = require('bedrock-messages-client');
var request = require('request');
var scheduler = require('bedrock-jobs');
var uuid = require('node-uuid').v4;
require('bedrock-express');

require('./config');

var api = {};
module.exports = api;

// TODO: Add logging info
var logger = bedrock.loggers.get('app');

bedrock.events.on('bedrock-express.configure.routes', function(app) {
  // TODO: Add authentication
  // TODO: Add validation
  // The restart-job endpoint is operating on the premise that there can only
  // be one client polling on an endpoint
  /**
   * Restarts message clients on the specified endpoints with
   * the specified interval. If no endpoints specified, all clients will
   * be restarted.
   *
   * @param interval the number of minutes to wait between polling
   * the endpoint (e.g. 1, 5, or 10)
   * @param endpoints array of endpoints for clients to be restarted
   */
  app.post(config['messages-client']['settings-endpoint'],
    function(req, res, next) {
      var interval = req.body.interval;
      var endpoints = req.body.endpoints;
      var clients =
        bedrock.util.clone(config['messages-client'].clients);

      if(!!endpoints) {
        clients = clients.filter(function(client) {
          return endpoints.indexOf(client.endpoint) >= 0;
        });
      }

      async.each(clients, function(client, callback) {
        api.start(client.endpoint, interval, callback);
      }, function(err) {
        if(err) {
          return next(new BedrockError(
            'Failed to start message client.',
            'MessageClientFailure',
            {interval: interval, httpStatusCode: 500, 'public': true}));
        }
        res.status(200);
        res.send();
      });
    });
});
