/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
require('../libs');

var config = bedrock.config;

config['messages-client'].clients.push({
  'endpoint': 'hello'
}, {
  'endpoint': 'world'
}, {
  'endpoint': 'apple'
});

bedrock.start();
