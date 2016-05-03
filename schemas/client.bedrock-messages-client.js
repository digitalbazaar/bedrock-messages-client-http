var schemas = require('bedrock-validation').schemas;
var constants = require('bedrock').config.constants;

var client = {
  type: 'object',
  properties: {
    id: schemas.identifier(),
    endpoint: schemas.url(),
    label: schemas.label(),
    publicKeyId: {required: true, type: 'string'},
    interval: {required: true, type: 'integer', minimum: 1},
    strictSSL: {type: 'boolean', required: true}
  },
  additionalProperties: false
};

module.exports.client = function() {
  return client;
};
