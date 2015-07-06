/** @jsx m */

"use strict";
require("./PillList.scss");

var _ = require("underscore");
var Typeahead = require("./Typeahead.js");

var PillList = {};

PillList.controller = function(options) {
  this.controllers = {};
  if (options.isNewRecord){ 
    this.isNewRecord = options.isNewRecord;
  }
  this.editable = options.editable;
  this.editing = m.prop(false);

  if (options.model) { // for arrays serialized on a model
    this.pills = function() {
      return _.map(options.model.get(options.attr || "tags"), function(pill) {
        return {label: pill, value: pill};
      });
    };
  } else if (options.collection) {
    this.pills = function() {
      return _.result(options, "collection").map(function(model) {
        return model.pill();
      });
    };
  } else {
    this.pills = options.currentState || m.prop([]);
  }

  var _this = this;
  this.addPill = function(newPill) {
    var pills = _this.pills();
    var values = _.pluck(pills, "value");
    if (!_.isEmpty(newPill.label) && !_.contains(values, newPill.value)) {
      values.push(newPill.value);
      if (options.model) {
        options.model.set((options.attr || "tags"), values);
      } else if (options.collection) {
        _.result(options, "collection").add(newPill.value);
      } else {
        pills.push(newPill);
        _this.pills(pills);
      }
      _this.controllers.recommendationsTypeahead.clear();
      return true;
    }
    return false;
  };

  this.removePill = function(toRemove) {
    var pills = _this.pills();
    if (toRemove) {
      if (options.collection) {
        return _.result(options, "collection").remove(toRemove.value);
      }

      pills = _.filter(pills, function(pill) {
        return pill.value !== toRemove.value;
      });
    } else {
      if (options.collection) {
        _this.controllers.recommendationsTypeahead.pill(_.result(options, "collection").last().pill());
        return _.result(options, "collection").remove(_.result(options, "collection").last());
      }
      _this.controllers.recommendationsTypeahead.pill(pills.pop());
    }

    _this.pills(pills);
    if (options.model) {
      options.model.set((options.attr || "tags"), _.pluck(pills, "value"));
    }
  };

  this.onRemoveClick = function(pill) {
    return function() {
      _this.removePill(pill);
    };
  };

  this.handleDivClick = function() {
    // "this" references the DOM node
    this.getElementsByTagName("input")[0].focus();
  };

  this.toggleEditMode = function() {
    _this.editing(!_this.editing());
  };

  if (options.typeahead) {
    this.controllers.recommendationsTypeahead = options.typeahead;
  } else {
    this.controllers.recommendationsTypeahead = new Typeahead.controller({ getter: options.getter });
    this.controllers.recommendationsTypeahead.submit = this.addPill;
  }
  // this.controllers.recommendationsTypeahead.onkeydown = function(e) {
  //   if (e.keyCode === 188) { // comma
  //     e.preventDefault();
  //     _this.addPill(_this.controllers.recommendationsTypeahead.pill());
  //   } else if (e.keyCode === 8 && _.isEmpty(_this.controllers.recommendationsTypeahead.pill().label)) {  // backspace
  //     e.preventDefault();
  //     if (!_.isEmpty(_this.pills()) )  {
  //       _this.removePill();
  //     }
  //   } else if (e.keyCode === 27) { // escape
  //     e.preventDefault();
  //     _this.editing(false);
  //   }
  // };
};

PillList.view = function(ctrl, options) {
  options = options || {};
  options.pillView = options.pillView || PillList.pillView;
  var pills;
  if (ctrl.editable()) {
    pills = _.map(ctrl.pills(), function(pill) {
      return options.pillView(pill, {onRemoveClick: ctrl.onRemoveClick});
    });
    
    if (ctrl.editing()) {
      return (
        <ul className={"PillList editing " + (options.className||"")} onclick={ctrl.handleDivClick}>
          {pills}
          <li className="pill">{Typeahead.view(ctrl.controllers.recommendationsTypeahead)}</li>
        </ul>
      );
    } else {
      if (pills.length === 0 && options.placeholder) {
        pills = <li className="pill placeholder">{options.placeholder}</li>;
      }
      if (ctrl.isNewRecord ) {
        if (!pills.length > 0) {
          pills = <li>{options.placeholder}</li>;
        }
        return (
          <ul className={"PillList " + (options.className||"")}>
            <li><span className="icon icon_add" title="Add" onclick={ctrl.toggleEditMode}></span></li>
            {pills}
          </ul>
        );
    } else {
        return (
          <ul className={"PillList " + (options.className||"")}>
            {pills}
            <li><span className="icon icon_add" title="Add" onclick={ctrl.toggleEditMode}></span></li>
          </ul>
        );
    }
    }
  } else {
    pills = _.map(_.compact(ctrl.pills()), function(pill) {
      return options.pillView(pill);
    });
    if (pills.length === 0 && options.placeholder) {
      pills = <li className="pill placeholder">{options.placeholder}</li>;
    }
    return (
      <ul className={"PillList " + (options.className||"")}>
        {pills}
      </ul>
    );
  }
};

PillList.pillView = function(pill, options) {
  options = options || {};

  if (options.onRemoveClick) {
    var removeIcon = <span className="icon icon_removed" onclick={options.onRemoveClick(pill)}></span>
  }
  return <li className="pill">{pill.label} {removeIcon}</li>
};

module.exports = PillList;
