"use strict";

module.exports = {
  upper: function (value) {
    return value.toUpperCase();
  },
  lower: function (value) {
    return value.toLowerCase();
  },
  trim: function (value) {
    return value.trim();
  },
  capitalize: function (value) {
    return value.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}