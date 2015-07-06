/** @jsx m */

"use strict";
require("./DropdownSelect.scss");

var _ = require("underscore");
var Dropdown = require("./Dropdown.js");

var DropdownSelect = {};

DropdownSelect.controller = function(options) {
  this.options = options.options;
  this.value = options.value;
  this.onchange = options.onchange;

  this.dropdownController = new Dropdown.controller({className: "DropdownSelect"});

  var _this = this;
  _this.handleClick = function(value) {
    return function() {
      if (value !== _this.value()) {
        _this.onchange(value);
      }
      _this.dropdownController.toggle();
    };
  };
};

DropdownSelect.view = function(ctrl) {
  var selectedValue = _.isUndefined(ctrl.value()) ? _.first(ctrl.options).value : ctrl.value();
  var label = _.findWhere(ctrl.options, {value: selectedValue}).content;

  var list = _.map(ctrl.options, function(option) {
    return <li onclick={ctrl.handleClick(option.value)} className={option.value === selectedValue ? "selected" : ""}>{option.content}</li>;
  });

  var content = <ul>{list}</ul>;

  return Dropdown.view(ctrl.dropdownController, content, label);
};

module.exports = DropdownSelect;
