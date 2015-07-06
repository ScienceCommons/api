"use strict";

var _ = require("underscore");

var ClassSet = function(classes) {
  return _.reduce(classes, function(str, val, key) {
    if (val) {
      str = str + " " + key;
    }
    return str;
  }, "");
};

module.exports = ClassSet;