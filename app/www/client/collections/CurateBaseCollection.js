/** @jsx m */

"use strict";

var BaseCollection = require("../models/BaseData.js").Collection;

var CurateBaseCollection = BaseCollection.extend({
  sync: function(method, collection, options) {
    options = options || {};
    options.config = function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
    };
    return BaseCollection.prototype.sync.call(this, method, collection, options);
  }
});

module.exports = CurateBaseCollection;
