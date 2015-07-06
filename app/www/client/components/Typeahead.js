/** @jsx m */

"use strict";
require("./Typeahead.scss");

var _ = require("underscore");
var m = require("mithril");

var Spinner = require("./Spinner.js");

var Typeahead = {};

Typeahead.controller = function(options) {
  this.open = m.prop(false);
  this.index = m.prop(-1); // used for selecting a recommendation
  this.userInput = m.prop(options.value || "");
  this.pill = m.prop({label: this.userInput(), value: this.userInput()})
  this.submit = options.submit;
  this.extras = options.extras || [];

  var _this = this;
  if (options.collection) {
    var search = _.debounce(options.collection.search, 300); // expects search method & debounces it since there is typing
    this.getter = function(val) {
      _this.open(!_.isEmpty(val));
      options.collection.loading = true;
      search({query: val, partial: true});
    };
    this.recommendations = options.collection;
    this.recommendationView = options.recommendationView;
  } else {
    this.recommendations = [];
  }
  // else {
  //   this.recommendations = m.prop([]); // cached recommendations
  //   this.getter = function(val) {
  //     if (_.isEmpty(val)) {
  //       _this.recommendations([]);
  //     } else {
  //       _this.recommendations(options.getter ? options.getter(val) : [val]);
  //     }
  //   };
  //   this.recommendationView = function(recommendation) { return recommendation.label; };
  // }


  // if (!this.submit) {
  //   throw("Typeahead: options.submit is required");
  // }

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    if (_this.recommendations.length > 0 && _this.index() < _this.recommendations.length) {
      var recommendation = _this.recommendations.at(_this.index());
      if (recommendation) {
        _this.submit(recommendation);
        return _this.clear();
      }
    } else {
      var extra = _this.extras[_this.index()-_this.recommendations.length];
      if (extra) {
        return extra.handleClick(_this.userInput())();
      }
    }
    _this.submit(_this.pill());
  };

  this.handleBlur = function() {
    _this.open(false);
    _this.index(-1);
  };

  this.handleRecommendationClick = function(val) {
    return function() {
      _this.submit(val);
      _this.clear();
    };
  };

  this.clear = function() {
    _this.userInput("");
    _this.pill({label: "", value: ""});
    _this.open(false);
    _this.index(-1);
  };

  this.handleInput = function(val) {
    _this.userInput(val);
    _this.pill({label: val, value: val});
    _this.index(-1);
    if (_.isFunction(_this.getter)) {
      _this.getter(val);
    }
  };

  this.handleKeydown = function(e) {
    var newIndex;
    if (e.keyCode === 40) { // down arrow
      e.preventDefault();
      _this.open(_this.userInput().length > 0);
      var newIndex = _this.index() + 1;
      if (newIndex >= (_this.recommendations.length + _this.extras.length)) {
        newIndex = -1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput()) || _this.index() >= _this.recommendations.length) {
        _this.pill({label: _this.userInput(), value: _this.userInput()});
      } else {
        _this.pill(_this.recommendations.at(_this.index()));
      }
    } else if (e.keyCode === 38) { // up arrow
      e.preventDefault();
      _this.open(_this.userInput().length > 0);
      newIndex = _this.index()-1;
      if (newIndex < -1) {
        newIndex = _this.recommendations.length + _this.extras.length - 1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput()) || _this.index() >= _this.recommendations.length) {
        _this.pill({label: _this.userInput(), value: _this.userInput()});
      } else {
        _this.pill(_this.recommendations.at(_this.index()));
      }
    } else if (e.keyCode === 27) { // escape
      if (_this.open()) {
        _this.open(false);
      } else if (options.onkeydown) {
        options.onkeydown(e);
      }
    } else if (options.onkeydown) { // give other components access
      _this.open(true);
      options.onkeydown(e);
    }
  };
};

Typeahead.view = function(ctrl) {
  var content;

  if (ctrl.open()) {
    var recommendations = ctrl.recommendations;
    if (recommendations.loading) {
      content = (
        <ul className="recommendations loading">
          <li>{Spinner.view()}</li>
        </ul>
      );
    } else {
      var list = recommendations.map(function(recommendation, i) {
        return <li className={i === ctrl.index() ? "selected" : ""} onclick={ctrl.handleRecommendationClick(recommendation)}>{ctrl.recommendationView(recommendation)}</li>;
      });
      list = list.concat(_.map(ctrl.extras, function(extra, i) {
        return <li className={(list.length + i) === ctrl.index() ? "selected" : ""} onclick={extra.handleClick(ctrl.userInput())}>{extra.label}</li>;
      }));
      content = <ul className="recommendations">{list}</ul>;
    }
  }

  return (
    <form className="Typeahead" onsubmit={ctrl.handleSubmit} config={Typeahead.config}>
      <input key="typeahead" type="text" value={ctrl.pill().label} oninput={m.withAttr("value", ctrl.handleInput)} onkeydown={ctrl.handleKeydown} />
      {content}
    </form>
  );
};

Typeahead.config = function(el, isInitialized) {
  if (!isInitialized) {
    el.getElementsByTagName("input")[0].focus();
  }
};

module.exports = Typeahead;
