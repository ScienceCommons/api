/** @jsx m */

"use strict";
require("./FullLayout.scss");
require("../components/Tooltipster.scss");

var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");
var FeedbackForm = require("../components/FeedbackForm.js");
var Modal = require("../components/Modal.js");
var Tooltipster = require("../components/Tooltipster.js");

var FullLayout = {};

FullLayout.controller = function(options) {
  OnUnload(this);
  options = options || {};
  this.id = options.id;
  this.header = options.header;
  this.user = options.user;

  this.controllers.userBar = new UserBar.controller({user: options.user})
  this.controllers.feedbackModal = new Modal.controller({className: "feedbackModal"});
  this.controllers.feedBackForm = new FeedbackForm.controller({user: this.user});

  var _this = this;
  this.handleFeedbackToggle = function() {
    _this.controllers.feedbackModal.open(true);
  }

  document.title = "Curate Science";
};

FullLayout.view = function(ctrl, content) {
  if (ctrl.user) {
    if (ctrl.controllers.feedbackModal.open()) {
      var feedbackModal = Modal.view(ctrl.controllers.feedbackModal, {
        label: "What can we do better?",
        content: FeedbackForm.view(ctrl.controllers.feedBackForm)
      });
    }
    var feedbackToggle = <div className="feedbackToggle" onclick={ctrl.handleFeedbackToggle}>Feedback</div>;
  }

  return (
    <div id={ctrl.id} className="page FullLayout">
      <header>
        {new UserBar.view(ctrl.controllers.userBar)}
        {ctrl.header}
        <a href="/" config={m.route} className="logo">{new Logo.view()}</a>
      </header>

      {feedbackToggle}
      {feedbackModal}

      <div className="pageContent">
        {content}
      </div>
    </div>
  );
};

module.exports = FullLayout;
