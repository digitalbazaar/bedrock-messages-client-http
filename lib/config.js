/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var config = require('bedrock').config;
var path = require('path');

config['messages-client-http'] = {};
// TODO: Decide best name for this endpoint
config['messages-client-http']['settings-endpoint'] =
  '/messages-client/settings/:endpoint';
