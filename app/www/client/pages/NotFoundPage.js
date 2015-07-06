/** @jsx m */

"use strict";
require("./NotFoundPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js")

var NotFoundPage = {};

NotFoundPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "NotFoundPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

NotFoundPage.view = function(ctrl) {
  var content = (
    <div>
      <h1>Sorry, we could not find the page you were looking for</h1>
      <p>Our team has been notified of this error.</p>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = NotFoundPage;

