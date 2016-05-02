/*
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var config = require('bedrock').config;
var path = require('path');

config['messages-client-http'] = {};
config['messages-client-http'].basePath = '/messages-client';
