"use strict";

var _ = require("underscore");

var OnUnload = function(ctrl, instances) {
  ctrl.id = _.uniqueId();
  ctrl.controllers = {};
  ctrl.onunload = function(e) {
    _.each(ctrl.controllers, function(subCtrl) {
      if (_.isFunction(subCtrl.onunload)) {
        subCtrl.onunload(e);
      }
    });

    if (instances) {
      delete instances[ctrl.id];
    }
  };
};

module.exports = OnUnload;
