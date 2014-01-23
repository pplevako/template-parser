var Rule = function (tokenName, pattern) {
  this.tokenName = tokenName;
  this.pattern = pattern;
};

Rule.prototype.getPattern = function () {
  return this.pattern;
}

Rule.prototype.getTokenName = function () {
  return this.tokenName;
}

module.exports = Rule;