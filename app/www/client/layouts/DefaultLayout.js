/** @jsx m */

"use strict";
require("./DefaultLayout.scss");
require("../components/Tooltipster.scss");

var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Search = require("../components/Search.js");
var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");
var FeedbackForm = require("../components/FeedbackForm.js");
var Modal = require("../components/Modal.js");
var Tooltipster = require("../components/Tooltipster.js");

var DefaultLayout = {};

DefaultLayout.controller = function(options) {
  OnUnload(this);
  options = options || {};
  this.id = options.id;
  this.user = options.user;

  this.controllers.userBar = new UserBar.controller({user: options.user});
  this.controllers.search = new Search.controller({query: m.route.param("query")});
  this.controllers.feedbackModal = new Modal.controller({className: "feedbackModal"});
  this.controllers.feedBackForm = new FeedbackForm.controller({user: this.user});

  var _this = this;
  this.handleFeedbackToggle = function() {
    _this.controllers.feedbackModal.open(true);
  }

  document.title = "Curate Science";
};

DefaultLayout.view = function(ctrl, content) {
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
    <div id={ctrl.id} className="page DefaultLayout">
      <header>
        <table className="banner">
          <tbody>
            <tr>
              <td className="bannerLogo"><a href="/" config={m.route} className="logoLink">{new Logo.view()}</a></td>
              <td className="bannerSearch">{new Search.view(ctrl.controllers.search)}</td>
              <td className="bannerUserBar">{new UserBar.view(ctrl.controllers.userBar)}</td>
            </tr>
          </tbody>
        </table>
      </header>

      {feedbackToggle}
      {feedbackModal}
      <div className="pageContent">{content}</div>
    </div>
  );
};

module.exports = DefaultLayout;
