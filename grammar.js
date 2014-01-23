"use strict";

var Rule = require('./rule');

//var TEXT = 'TEXT';
//var SUBSTITUTE = 'SUBSTITUTE';
//var BLOCK_BEGIN = 'BLOCK_BEGIN';
//var BLOCK_NEST = 'BLOCK_NEST';
//var BLOCK_PLACEHOLDER = 'PLACEHOLDER';
//var BLOCK_END = 'BLOCK_END';

var tokens = {
  TEXT: 'TEXT',
  SUBSTITUTE: 'SUBSTITUTE',
  BLOCK_BEGIN: 'BLOCK_BEGIN',
  BLOCK_NEST: 'BLOCK_NEST',
  BLOCK_PLACEHOLDER: 'PLACEHOLDER',
  BLOCK_END: 'BLOCK_END'
};

var rules = [
  new Rule(tokens.SUBSTITUTE, '\\{\\{\\s*[a-zA-Z_]+[a-zA-Z0-9_]*\\s*\\}\\}'),
  new Rule(tokens.BLOCK_BEGIN, '\\{%\\s*[a-zA-Z_]+[a-zA-Z0-9_]*\\s*%\\}'),
  new Rule(tokens.BLOCK_NEST, '\\{%\\s*\\.*\\s*%\\}'),
  new Rule(tokens.BLOCK_PLACEHOLDER, '\\{\\{\\s*\\.*\\s*\\}\\}'),
  new Rule(tokens.BLOCK_END, '\\{%\\s*\\/\\s*%\\}'),
];

exports.tokens = tokens;
exports.rules = rules;
