"use strict";

/**
 * Created by renpika on 1/23/14.
 */

var grammar = require('./grammar');
var Lexer = require('./lexer');
var filterFuncs = require('./filters');
var Stack = require('./stack');
var util = require('util');

var render = function (template, data) {
  //Remove comments
  template = template.replace(/\{#[^]*?#\}/g, '');
  var lexer = new Lexer(grammar.rules, template);
  var tokens = lexer.tokenize();
  tokens = prettifyTokens(tokens);
  var parser = new Parser(tokens, data);
  return parser.parse();
};

module.exports = render;

var Parser = function (tokens, data) {
  this.tokens = tokens;
  this.data = data;
}

Parser.prototype.parseTree = function (nodes, currentData, listAcc) {
  var self = this;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node instanceof BlockNode) {
      var data = node.data ? node.data : currentData;
      data.forEach(function (value) {
        self.parseTree(node.children(), value, listAcc);
      });
    } else {
      listAcc.push(node.evaluate(currentData));
    }
  }
};

Parser.prototype.parse = function () {
  var self = this;
  var stack = new Stack;
  var root = new BlockNode(null);
  stack.push(root);
  this.tokens.forEach(function (token) {
    switch (token.name) {

      case grammar.tokens.BLOCK_BEGIN:
        var data = self.data[token.value];
        var block = new BlockNode(data);
        //TODO stack.peek().addChild(...) - separate function?
        stack.peek().addChild(block);
        stack.push(block);
        break;

      case grammar.tokens.BLOCK_NEST:
        var block = new BlockNode(null);
        stack.peek().addChild(block);
        stack.push(block);
        break;

      case grammar.tokens.PLACEHOLDER_BEGIN:
        var placeholder = new PlaceholderNode();
        stack.peek().addChild(placeholder);
        stack.push(placeholder);
        break;

      case grammar.tokens.SUBSTITUTE_BEGIN:
        var substitute = new SubstituteNode(token.value, self.data);
        stack.peek().addChild(substitute);
        stack.push(substitute);
        break;

      case grammar.tokens.FILTER:
        var filter = new FilterNode(token.value);
        stack.peek().addChild(filter);
        break;

      case grammar.tokens.FILTER_DEFAULT:
        var filter = new FilterNodeDefault(token.value);
        stack.peek().addChild(filter);
        break;

      case grammar.tokens.BRACKET_END:
        stack.pop();
        break;

      case grammar.tokens.TEXT:
        var text = new TextNode(token.value);
        stack.peek().addChild(text);
        break;

      case grammar.tokens.BLOCK_END:
        //TODO add syntax check
        var block = stack.pop();
        break;
    }
  });
  var listAcc = [];
  this.parseTree(root.children(), null, listAcc);
  return listAcc.join('');
};

var prettifyTokens = function (tokens) {
  tokens.forEach(function (token) {
    if (token.name === grammar.tokens.TEXT)
      return;
    if (token.name === grammar.tokens.FILTER_DEFAULT) {
      var match = token.value.match(/\s*:\s*default\s*\((.*)\)/);
      token.value = match[1];
    } else {
      token.value = token.value.replace(/[%,\s,\{,\},:]*/g, '');
    }
  });
  return tokens;
};

var TreeNode = function() {
  this.childNodes = [];
}

TreeNode.prototype.addChild = function(childNode) {
  this.childNodes.push(childNode);
}

TreeNode.prototype.children = function() {
  return this.childNodes;
}

var BlockNode = function (data) {
  BlockNode.super_.call(this);
  this.data = data;
}
util.inherits(BlockNode, TreeNode);

var TextNode = function (value) {
  this.value = value;
}

TextNode.prototype.evaluate = function(_) {
  return this.value;
}

var SubstituteNode = function (value, dataObj) {
  SubstituteNode.super_.call(this);
  this.value = dataObj[value];
}
util.inherits(SubstituteNode, TreeNode);

SubstituteNode.prototype.evaluate = function(_) {
  return applyFilters(this.value, this.children());
}

var PlaceholderNode = function () {
  PlaceholderNode.super_.call(this);
}
util.inherits(PlaceholderNode, TreeNode);

PlaceholderNode.prototype.evaluate = function(value) {
  return applyFilters(value, this.children());
}

var FilterNodeDefault = function(defaultValue) {
  this.defaultValue = defaultValue;
}

FilterNodeDefault.prototype.evaluate = function(value) {
  if (!value)
    return this.defaultValue;
  return value;
}

var FilterNode = function(filterKey) {
  this.filterKey = filterKey;
}

FilterNode.prototype.evaluate = function(value) {
  var filterFunc = filterFuncs[this.filterKey];
  return filterFunc(value);
}

var applyFilters = function(value, filters) {
  for (var i = 0; i < filters.length; i++) {
    var filter = filters[i];
    value = filter.evaluate(value);
  }
  return value;
}