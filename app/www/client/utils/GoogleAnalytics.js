"use strict";

var _ = require("underscore");
window.ga = window.ga || _.noop;

var GoogleAnalytics = {};

GoogleAnalytics.TrackNavigation = function() {
  ga("send", "pageview", "/beta" + m.route());
};

module.exports = GoogleAnalytics;
