/** @jsx m */

"use strict";
require("./Tooltip.scss");

var _ = require("underscore");
var m = require("mithril");

var Tooltip = {};

Tooltip.controller = function() {
  this.open = m.prop(false);
  this.el = document.createElement("div");
};

Tooltip.view = function(ctrl, options) {
  options = options || {};
  if (ctrl.open()) {
    if (options.title) {
      var title = <header>{options.title}</header>;
    }
    return (
      <div className={"Tooltip " + (title ? "titled " : "") + (options.position ? options.position : "bottom" ) + " " + (ctrl.open() === "closing" ? "closing" : "")}>
        <div className="tooltipArrow"></div>
        {title}
        <div className="tooltipContent">{options.content}</div>
      </div>
    );
  }
};

Tooltip.config = function(el, isInitialized, context) {
  if (!isInitialized) {
    el.style.position = "relative";
    el._tooltip = new Tooltip.controller();
    el.appendChild(el._tooltip.el);

    var enterFn = onEnter(el);
    var leaveFn = onLeave(el);
    el.addEventListener("mouseenter", enterFn);
    el.addEventListener("mouseleave", leaveFn);

    context.onunload = function() {
      el.removeEventListener("mousedown", enterFn);
      el.removeEventListener("mouseleave", leaveFn);
    };

    // inspired by https://groups.google.com/forum/#!searchin/mithriljs/Saytam/mithriljs/lhADPdnr6L8/FrMci1oqq7oJ
    //m.module(el, {
    //  controller: function() { return el._tooltip; },
    //  view: Tooltip.view
    //});
  }
  m.render(el._tooltip.el, Tooltip.view(el._tooltip, getOptions(el)));
};

module.exports = Tooltip;

// helpers

function onEnter(el) {
  return function(e) {
    if (el._tooltip.timeout) {
      clearTimeout(el._tooltip.timeout)
    }
    el._tooltip.open(true);
    m.render(el._tooltip.el, Tooltip.view(el._tooltip, getOptions(el)));
  };
}

var delay = 300;
function onLeave(el) {
  return function(e) {
    el._tooltip.open("closing");
    el._tooltip.timeout = setTimeout(function() {
      el._tooltip.timeout = null;
      el._tooltip.open(false);
      m.render(el._tooltip.el, Tooltip.view(el._tooltip, getOptions(el)));
    }, delay);
    m.render(el._tooltip.el, Tooltip.view(el._tooltip, getOptions(el)));
  };
}

function getOptions(el) {
  return _.reduce(["title", "content"], function(opts, attr) {
    var domAttr = el.attributes["data-tooltip-"+attr];
    if (domAttr) {
      opts[attr] = domAttr.value;
    }
    return opts;
  }, {});
}
