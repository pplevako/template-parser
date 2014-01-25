"use strict";

/**
 * Created by renpika on 1/23/14.
 */

var grammar = require('./grammar');
var Lexer = require('./lexer');
var filters = require('./filters');
var Stack = require('./stack');

var applyFilters = function(value, filtersKeys) {
  for (var i = 0; i < filtersKeys.length; i++) {
    var filter = filters[filtersKeys[i]];
    value = filter(value);
  }
  return value;
}

var BlockNode = function (data) {
  this.children = [];
  this.data = data;
}

BlockNode.prototype.addChild = function (child) {
  this.children.push(child);
}

var TextNode = function (value) {
  this.value = value;
}
TextNode.prototype.evaluate = function(_) {
  return this.value;
}

var SubstituteNode = function (value, dataObj) {
  var fields = value.split(':');
  value = dataObj[fields[0]];
  this.value = applyFilters(value, fields.slice(1));
}

SubstituteNode.prototype.evaluate = function(_) {
  return this.value;
}

var PlaceholderNode = function (value) {
  var fields = value.split(':');
  this.filters = fields.slice(1);
}

PlaceholderNode.prototype.evaluate = function(value) {
  return applyFilters(value, this.filters);
}

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
        self.parseTree(node.children, value, listAcc);
      });
    } else {
      listAcc.push(node.evaluate(currentData));
    }


//    else if (node instanceof PlaceholderNode) {
//      listAcc.push(currentData);
//    }
//    else if (node instanceof SubstituteNode) {
//      listAcc.push(node.evaluate());
//    }
//    else if (node instanceof TextNode) {
//      listAcc.push(node.value);
//    }
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

      case grammar.tokens.BLOCK_PLACEHOLDER:
        var placeholder = new PlaceholderNode(token.value);
        stack.peek().addChild(placeholder);
        break;

      case grammar.tokens.SUBSTITUTE:
//        var data = self.data[token.value];
        var substitute = new SubstituteNode(token.value, self.data);
        stack.peek().addChild(substitute);
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
  this.parseTree(root.children, null, listAcc);
  return listAcc.join('');
};

var prettifyTokens = function (tokens) {
  tokens.forEach(function (token) {
    if (token.name === grammar.tokens.BLOCK_BEGIN
      || token.name === grammar.tokens.SUBSTITUTE
      || token.name === grammar.tokens.BLOCK_PLACEHOLDER) {
      token.value = token.value.replace(/^\{(%|\{)\s*|\s*(%|\})\}$/g, '');
    }
  });
  return tokens;
};

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