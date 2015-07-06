/** @jsx m */

"use strict";
require("./ListEditor.scss");

var _ = require("underscore");

var ListEditor = {};

ListEditor.controller = function(options) {
  this.items = options.items;
  this.editing = options.editing;

  var _this = this;
  this.updateItem = function(i) {
    return function(val) {
      var items = _this.items();
      items[i] = val;
      _this.items(items);
    };
  };
};

ListEditor.view = function(ctrl, options) {
  options = options || {};
  var content;
  var items = ctrl.items();

  if (ctrl.editing()) {
    if (_.last(items) !== "") {
      items = items.concat([""]);
    }

    content = _.map(items, function(item, i) {
      return <li key={i}>
        <input type="text" placeholder={options.placeholder||""} value={item} oninput={m.withAttr("value", ctrl.updateItem(i))} />
      </li>;
    });
  } else {
    content = _.map(items, function(item) {
      return <li>{item}</li>;
    });
  }
  
  return <ul className="ListEditor">{content}</ul>;
};

module.exports = ListEditor;
