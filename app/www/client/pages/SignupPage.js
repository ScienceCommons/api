/** @jsx m */

"use strict";
require("./SignupPage.scss");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js");

var SignupPage = {};

SignupPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "SignupPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

SignupPage.view = function(ctrl) {
  var content = (
    <div>
      <h3>Register for an invite</h3>
      <form action="http://christianbattista.us7.list-manage.com/subscribe/post?u=d140eca9cfe4a96473dac6ea5&amp;id=fba08af7dd" method="post" target="_blank">
        <input type="email" value="" ref="email" name="EMAIL" placeholder="Enter email address" size="30" required />
        <div style={{"position": "absolute", "left": "-5000px"}}>
          <input type="text" name="b_d140eca9cfe4a96473dac6ea5_fba08af7dd" value="" />
        </div>
        <button type="submit">Request invite</button>
      </form>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = SignupPage;
