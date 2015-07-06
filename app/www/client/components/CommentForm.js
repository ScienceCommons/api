/** @jsx m */

"use strict";
require("./CommentForm.scss");

var m = require("mithril");

var CommentForm = {};

CommentForm.controller = function(options) {
  this.body = m.prop("");
  this.anonymous = m.prop(false);
  this.user = options.user;
  this.comments = options.comments;
  this.field = options.field;

  var _this = this;

  this.handleSubmit = function(e) {
    e.preventDefault();
    var res = _this.comments.add({
      "owner_id": _this.user.get("id"),
      "comment": _this.body(),
      "anonymous": _this.anonymous(),
      "field": _this.field,
      "name": _this.user.get("fullName"),
      "created_at": (new Date()).toString()
    }, {sync: true});

    _this.body("");
    if (options.onAdd) {
      options.onAdd();
    }
  };

  this.handleInput = function() {
    _this.body(this.value);
    CommentForm.autosize(this);
  };
};

CommentForm.autosize = function(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight+'px';
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onsubmit={ctrl.handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td className="commentBodyTextarea"><textarea value={ctrl.body()} oninput={ctrl.handleInput} placeholder="Leave a comment"/></td>
            <td className="commentSubmit">
              <div><button type="submit" className="btn post">Post</button></div>
              <div className="toggleAnonymous">
                <label><input type="checkbox" value={ctrl.anonymous()} onchange={m.withAttr("checked", ctrl.anonymous)}/> Anonymous</label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

module.exports = CommentForm;
