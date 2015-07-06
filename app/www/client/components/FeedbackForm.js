/** @jsx m */

"use strict";

require("./FeedbackForm.scss");

var _ = require("underscore");
var m = require("mithril");
var Spinner = require("../components/Spinner.js");
var FeedbackMessageModel = require("../models/FeedbackMessageModel.js");

var FeedbackForm = {};

FeedbackForm.controller = function(options) {
  this.user = options.user;
  this.feedback_message = new FeedbackMessageModel();

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    var details = _this.feedback_message.get("details");
    details.url = window.location.href;
    _this.feedback_message.set("details", details);
    _this.feedback_message.save().then(function() {
      _this.feedback_message = new FeedbackMessageModel();
    }, function() {
      // error
    });
  };
};

FeedbackForm.view = function(ctrl) {
  var feedback = ctrl.feedback_message;
  if (feedback.saving) {
    var spinner = Spinner.view();
  } else {
    if (feedback.hasErrors()) {
      var errors = _.map(feedback.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul className="errors">{errors}</ul>;
    }
  }

  return <form className="FeedbackForm" onsubmit={ctrl.handleSubmit}>
    {spinner}
    {errorMessage}
    <div>
      <textarea placeholder="Feedback here" rows="10" columns="80" oninput={m.withAttr("value", feedback.setter("message"))}>{feedback.get("message")}</textarea>
    </div>
    <div>
      <button type="submit" className="btn">Submit</button>
    </div>
  </form>;
};

module.exports = FeedbackForm;
