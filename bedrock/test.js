/*
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
require('../lib/client-http.js');

var config = bedrock.config;

config['messages-client'].clients.push({
  'endpoint': 'hello'
}, {
  'endpoint': 'world'
}, {
  'endpoint': 'apple'
});

bedrock.start();
