/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var config = require('bedrock').config;
var path = require('path');
require('bedrock-validation');

config['messages-client-http'] = {};
config['messages-client-http'].basePath = '/messages-client';
// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
