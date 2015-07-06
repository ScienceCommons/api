/** @jsx m */

"use strict";
require("./Search.scss");

var m = require("mithril");

var Search = {};

Search.controller = function(options) {
  options = options || {};

  this.query = m.prop(options.query || "");
  this.size = options.size || 30;
  this.className = options.className || "";

  var _this = this;
  this.updateSearch = function(e) {
    e.preventDefault();
    m.route("/query/"+encodeURIComponent(_this.query()));
  };
};

Search.view = function(ctrl) {
  return (
      m("form", {onsubmit:ctrl.updateSearch, className:"Search " + ctrl.className}, [
        m("input", {config:focusConfig, type:"text", id:"search-articles", placeholder:"Search for articles", autocomplete:"off", size:ctrl.size, value:ctrl.query(), oninput:m.withAttr("value", ctrl.query)} ),
        " ",m("span", {class:"glyphicon glyphicon-info-sign tooltip white-big-tooltip", title:"Search for published articles (e.g., \"<a href=\"https://www.curatescience.org/beta/#/query/bargh%20warmth\">Bargh warmth</a>\") or replications (e.g., \"<a href=\"https://www.curatescience.org/beta/#/query/pashler%20elderly%20priming\">Pashler elderly priming</a>\")."})
      ])
    );
};

function focusConfig(el, isInitialized) {
  if (!isInitialized) {
    if(m.route() == "/") {
      el.focus();
    }
  }
}

module.exports = Search;
