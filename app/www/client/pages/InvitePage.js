/** @jsx m */

"use strict";
require("./InvitePage.scss");

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");
var InviteModel = require("../models/InviteModel.js");

var InvitePage = {};

InvitePage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "InvitePage"}, options);
  this.user = options.user;
  this.controllers.layout = new Layout.controller(options);
  this.newInvite = new InviteModel();
  this.saving = m.prop(false);

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    _this.newInvite.save().then(function() {
      _this.saving(false);
      if (_this.newInvite.get("inviter_id")) {
        _this.newInvite = new InviteModel();
      }
      m.redraw();
    });
    _this.saving(true);
  };
};

InvitePage.view = function(ctrl) {
  var invite_count = ctrl.user.get("invite_count");
  var heading;
  if (ctrl.user.get("admin")) {
    heading = <h1>Invite users</h1>;
  } else {
    heading = <h1>You have {invite_count} invite{invite_count == 1 ? "" : "s"} remaining</h1>;
  }

  if (ctrl.user.get("admin") || invite_count > 1) {
    var form = <form onsubmit={ctrl.handleSubmit}>
      <div>
        <input type="text" placeholder="Email" value={ctrl.newInvite.get("email")} oninput={m.withAttr("value", ctrl.newInvite.setter("email"))}/>
      </div>
      <button className="btn invite" type="submit" disabled={ctrl.saving()}>{ctrl.saving() ? "Inviting...": "Invite"}</button>
    </form>;
  } else {
    var no_invites_message = <p>Please wait to get more invites.</p>;
  }

  var content = (
    <div>
      {heading}
      {form}
      {no_invites_message}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = InvitePage;
