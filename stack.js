"use strict";

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

module.exports = Stack;