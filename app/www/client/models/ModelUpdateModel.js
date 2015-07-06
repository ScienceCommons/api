/** @jsx m */

"use strict";

var _ = require("underscore");
var vagueTime = require("vague-time/lib/vagueTime-en");

var CurateBaseModel = require("./CurateBaseModel.js");

var ModelUpdateModel = CurateBaseModel.extend({
  initialize: function() {
    if (_.isUndefined(this.get("created_at"))) {
      this.set("created_at", (new Date()).toString());
    }
  },
  sync: _.noop,
  computeds: {
    date: function() {
      return new Date(this.get("created_at"));
    },
    timeAgo: function() {
      return vagueTime.get({ to: this.get("date") });
    }
  },
  hasFieldChanges: function(field) {
    return !_.isUndefined(this.get("model_changes")[field]);
  }
});

module.exports = ModelUpdateModel;
