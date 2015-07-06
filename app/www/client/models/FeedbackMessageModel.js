/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");

var FeedbackMessageModel = CurateBaseModel.extend({
  name: "FeedbackMessage",
  defaults: {
    message: "",
    details: {}
  },
  urlRoot: "feedback_messages"
});

module.exports = FeedbackMessageModel;
