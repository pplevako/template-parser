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

var spaces = '\\s*';
var word = '[a-zA-Z_]+\\w*';
var filters = '(?::' + word + '|:default\\(' + word + '\\))*';
var rules = [
  new Rule(tokens.SUBSTITUTE, '\\{\\{' + spaces + word + filters + spaces + '\\}\\}'),
  new Rule(tokens.BLOCK_BEGIN, '\\{%\\s*' + word +'\\s*%\\}'),
  new Rule(tokens.BLOCK_NEST, '\\{%\\s*\\.*\\s*%\\}'),
  new Rule(tokens.BLOCK_PLACEHOLDER, '\\{\\{'+ spaces +'\\.' + filters + spaces +'\\}\\}'),
  new Rule(tokens.BLOCK_END, '\\{%\\s*\\/\\s*%\\}')
];

exports.tokens = tokens;
exports.rules = rules;
