/** @jsx m */

"use strict";
require("./Modal.scss");

var _ = require("underscore");
var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var ScrollIntoView = require("../utils/ScrollIntoView.js");

var Modal = {};

Modal.instances = {};

Modal.controller = function(options) {
  options = options || {};

  this.open = m.prop(false);
  this.className = options.className || "";
  this.wrapper = options.wrapper;

  var _this = this;
  this.toggle = function(e) {
    _this.open(!_this.open());
  };

  this.close = function() {
    _this.open(false);
  };

  this.closeOnEscape = function(e) {
    if (e.keyCode === 27) { // escape
      _this.close();
      m.redraw();
    }
  };

  this.id = _.uniqueId();
  Modal.instances[this.id] = this;
  this.onunload = function() {
    delete Modal.instances[_this.id];
  };

  this.config = function(el, isInitialized, context) {
    _this.el = el;

    if (!isInitialized) {
      ScrollIntoView(el);
      document.body.classList.add("modal_open");
      document.body.addEventListener("keydown", _this.closeOnEscape);

      context.onunload = function() {
        document.body.removeEventListener("keydown", _this.closeOnEscape);
        if (!_.any(Modal.instances, function(modal) { return modal.open() && modal.el !== el; })) {
          document.body.classList.remove("modal_open");
        }
      };
    }
  };
};

Modal.view = function(ctrl, options) {
  options = options || {};

  if (ctrl.open()) {
    if (options.footer) {
      var footer = <tfoot><tr><td>{options.footer}</td></tr></tfoot>;
    }
    if (options.buttons !== false) {
      var buttons = options.buttons || <button className="btn xClose" onclick={ctrl.toggle}><span className="icon icon_close"/></button>;
      buttons = <td className="modalActions">{buttons}</td>;
    }
    var body = <table>
      <thead><tr><th>
        <table><tbody><tr>
          <td className="modalHeading">
            {options.label}
          </td>
          {buttons}
        </tr></tbody></table>
      </th></tr></thead>
      <tbody><tr><td><div className="modalContent">{options.content}
      </div></td></tr></tbody>
      {footer}
    </table>

    if (options.wrapper) {
      options.wrapper.children = [body];
      options.wrapper.attrs.className = (options.wrapper.attrs.className || "") + " modalWrapper";
      body = options.wrapper;
    }

    return (
      <div className={"Modal " + ctrl.className} config={ctrl.config}>
        {body}
      </div>
    );
  }
};

document.addEventListener("mousedown", closeModalsOnMousedown);
document.addEventListener("touchstart", closeModalsOnMousedown);

module.exports = Modal;

// helpers

function closeModalsOnMousedown(e) {
  _.each(Modal.instances, function(modal) {
    if (modal.open() && modal.el && !modal.el.contains(e.target)) {
      modal.close();
    }
  });
  m.redraw();
}
