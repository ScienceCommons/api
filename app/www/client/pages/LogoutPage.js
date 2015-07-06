/** @jsx m */

"use strict";
require("./LogoutPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js");
var Spinner = require("../components/Spinner.js");

var LogoutPage = {};

LogoutPage.controller = function(options) {
  OnUnload(this);
  this.controllers.layout = new Layout.controller(_.extend({id: "LogoutPage"}, options));

  options.user.logout().then(function() {
    delete CS.user;
    m.route("/");
  }, function() {
    delete CS.user;
    m.route("/");
  });
};

LogoutPage.view = function(ctrl) {
  var content = (
    <div>
      <h3>Logging out</h3>
      {new Spinner.view()}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LogoutPage;
