"use strict";

/**
 * Created by renpika on 1/23/14.
 */

var grammar = require('./grammar');
var Lexer = require('./lexer');

var Stack = function () {
  this.array = [];
}

Stack.prototype.pop = function () {
  return this.array.pop();
}

Stack.prototype.push = function (element) {
  return this.array.push(element);
}

Stack.prototype.peek = function () {
  return this.array[this.array.length - 1];
}

var BlockNode = function (data) {
  this.children = [];
  this.data = data;
//  this.type = type;
}

BlockNode.prototype.addChild = function (child) {
  this.children.push(child);
}

var TextNode = function (value) {
  this.value = value;
}

var SubstituteNode = function (data) {
  this.data = data;
}

var PlaceholderNode = function () {

}
//
//var NODE_TYPE = {
//  BLOCK: "BLOCK",
//  TEXT: "TEXT",
//  BLOCK_PLACEHOLDER: "BLOCK_PLACEHOLDER",
//  SUBSTITUTE: "SUBSTITUTE"
//}

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
    }
    else if (node instanceof PlaceholderNode) {
      listAcc.push(currentData);
    }
    else if (node instanceof SubstituteNode) {
      listAcc.push(node.data);
    }
    else if (node instanceof TextNode) {
      listAcc.push(node.value);
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

      case grammar.tokens.BLOCK_PLACEHOLDER:
        var placeholder = new PlaceholderNode();
        stack.peek().addChild(placeholder);
        break;

      case grammar.tokens.SUBSTITUTE:
        var data = self.data[token.value];
        var substitute = new SubstituteNode(data);
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
    if (token.name === grammar.tokens.BLOCK_BEGIN || token.name === grammar.tokens.SUBSTITUTE) {
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