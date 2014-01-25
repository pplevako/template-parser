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
  PLACEHOLDER_BEGIN: 'PLACEHOLDER_BEGIN',
  BLOCK_END: 'BLOCK_END',
  SUBSTITUTE_BEGIN: 'SUBSTITUTE_BEGIN',
  FILTER: 'FILTER',
  FILTER_DEFAULT: 'FILTER_DEFAULT',
  BRACKET_END: 'BRACKET_END'
};

var spaces = '\\s*';
var word = '[a-zA-Z_]+\\w*';
var rules = [
//  new Rule(tokens.SUBSTITUTE, '\\{\\{' + spaces + word + filters + spaces + '\\}\\}'),
  new Rule(tokens.BLOCK_BEGIN, '\\{%\\s*' + word +'\\s*%\\}'),
  new Rule(tokens.BLOCK_NEST, '\\{%\\s*\\.*\\s*%\\}'),
  new Rule(tokens.PLACEHOLDER_BEGIN, '\\{\\{'+ spaces +'\\.'),
  new Rule(tokens.BLOCK_END, '\\{%\\s*\\/\\s*%\\}'),
  new Rule(tokens.SUBSTITUTE_BEGIN, '\\{\\{'+ spaces + word),
  new Rule(tokens.FILTER_DEFAULT, spaces + ':' + spaces + 'default' + spaces + '\\([^)]*\\)'),
  new Rule(tokens.FILTER, spaces + ':' + spaces + word),
  new Rule(tokens.BRACKET_END, spaces + '\\}\\}')
];

exports.tokens = tokens;
exports.rules = rules;
