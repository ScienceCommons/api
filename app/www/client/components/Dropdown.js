/** @jsx m */

"use strict";
require("./Dropdown.scss");

var _ = require("underscore");
var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var ScrollIntoView = require("../utils/ScrollIntoView.js");

var Dropdown = {};

Dropdown.instances = {};

Dropdown.controller = function(options) {
  options = options || {};

  this.open = m.prop(false);
  this.className = options.className || "";
  this.label = options.label;
  this.caret = _.isUndefined(options.caret) ? true : options.caret;

  var _this = this;
  this.toggle = function(e) {
    _this.open(!_this.open());
  };

  this.close = function() {
    _this.open(false);
  };

  this.id = _.uniqueId();
  Dropdown.instances[this.id] = this;
  this.onunload = function() {
    delete Dropdown.instances[_this.id];
  };

  this.contentConfig = function(el, isInitialized) {
    _this.contentEl = el;
    if (!isInitialized) {
      ScrollIntoView(el);
    }
  };

  this.buttonConfig = function(el, isInitialized) {
    _this.buttonEl = el;
  };
};

Dropdown.view = function(ctrl, content, label) {
  if (ctrl.open()) {
    var dropdownContent = <div className="dropdownContent" config={ctrl.contentConfig}>{content}</div>;
  }

  if (ctrl.caret) {
    var caret = <span className="icon icon_down_caret arrow"></span>;
  }

  return (
    <div className={"Dropdown " + ctrl.className}>
      <button type="button" className="btn btn_subtle" onmousedown={ctrl.toggle} ontouchstart={ctrl.toggle} config={ctrl.buttonConfig}>
        {label || ctrl.label} {caret}
      </button>
      {dropdownContent}
    </div>
  );
};

document.addEventListener("mousedown", closeDropdownsOnMousedown);
document.addEventListener("touchstart", closeDropdownsOnMousedown);

module.exports = Dropdown;

// helpers

function closeDropdownsOnMousedown(e) {
  _.each(Dropdown.instances, function(dropdown) {
    if (dropdown.open() && dropdown.buttonEl && dropdown.contentEl && !dropdown.buttonEl.contains(e.target) && !dropdown.contentEl.contains(e.target)) {
      dropdown.close();
    }
  });
  m.redraw();
}
