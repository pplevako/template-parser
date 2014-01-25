"use strict";

var Token = require('./token');
var grammar = require('./grammar');

var Lexer = function (rules, input) {

  this.input = input;
  this.rules = rules;
  //TODO empty RegExp cause infinite loop
  if (rules.length === 0)
    throw Error('Rules are empty');
  var regexParts = [];
  for (var i = 0; i < rules.length; ++i) {
    regexParts.push('(' + rules[i].getPattern() + ')');
  }
  this.regex = new RegExp(regexParts.join('|'), 'g');
}

Lexer.prototype.tokenize = function () {
  var lastIndex = 0;
  var tokens = [];
  var result;

  var addText = function(text) {
    if (text)
      tokens.push(new Token(grammar.tokens.TEXT, text));
  }

  while (result = this.regex.exec(this.input)) {
    // Searching for a matching rule
    for (var i = 0; i < this.rules.length; i++) {
      // result[0]
      if (result[i + 1] !== undefined) {
        var value = result[0];
        var text = this.input.substr(lastIndex, result.index - lastIndex);
        addText(text);
        tokens.push(new Token(this.rules[i].getTokenName(), value));
        lastIndex = result.index + value.length;
      }
    }
  }
  var text = this.input.substr(lastIndex);
  addText(text);

  return tokens;
}

module.exports = Lexer;
