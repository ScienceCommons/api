/** @jsx m */

"use strict";
require("./UserBar.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Dropdown = require("./Dropdown.js");

var UserBar = {};

UserBar.controller = function(options) {
  OnUnload(this);
  this.user = options.user;

  if (this.user) {
    this.controllers.dropdown = new Dropdown.controller({
      className: "user",
      label: this.user.get("email")
    });
  }
};

UserBar.view = function(ctrl) {
  var user = ctrl.user;
  if (!user) {
    return <ul className="UserBar">
             <li>
               <div class="Dropdown user">
                 <button class="btn btn_subtle" type="button" onclick={route("/login")}>Login</button>
               </div>
             </li>
           </ul>;
  }

  var extras = [];
  if (user.canInvite()) {
    extras.push(routeLi("/invite", "Invite a friend"));
  }

  if (user.canEdit()) {
    extras.push(routeLi("/articles/new", "Add an article"));
  }

  var adminExtras = [];
  if (user.get("admin")) {
    adminExtras.push(routeLi("/admin", "Admin"));
  }

  if (extras.length > 0) {
    extras.unshift(<li className="separator"></li>);
  }
  if (adminExtras.length > 0) {
    adminExtras.unshift(<li className="separator"></li>);
  }

  var dropdownContent = (
    <ul>
      {routeLi("/profile", "Profile")}
      {routeLi("/bookmarks", "Bookmarks")}
      {routeLi("/logout", "Log out")}
      {extras}
      {adminExtras}
    </ul>
  );

  return (
    <ul className="UserBar">
      <li>{new Dropdown.view(ctrl.controllers.dropdown, dropdownContent)}</li>
    </ul>
  );
};

function routeLi(path, name) {
  return <li onclick={route(path)} className={m.route() === path ? "selected" : ""}>{name}</li>;
};

function route(path) {
  return function(e) {
    return m.route(path);
  };
};

module.exports = UserBar;
