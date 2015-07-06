"use strict";

var _ = require("underscore");
var m = require("mithril");

var CurateBaseCollection = require("./CurateBaseCollection.js");

var UserCollection = CurateBaseCollection.extend({
  name: "UserCollection",
  model: require("../models/UserModel.js"),
  initialize: function() {
    this.total = 0;
    this.loading = false;
    this.error = null;
  },
  search: function(options) {
    var url = API_ROOT + "users?q=" + options.query;
    if (!_.isUndefined(options.from)) {
      url = url + "&from=" + options.from;
    }
    var _this = this;
    var t0 = _.now();
    this.loading = true;
    this.error = null;
    var res = this.sync("read", this, {url: url})
    res.then(function(res) {
      var t1 = _.now();
      _this.loading = false;
      _this.total = res.total;
      _this.query = options.query;
      _this.from = res.from;
      _this.reset(res.documents);
      ga('send', 'timing', 'Users', 'Fetch', t1-t0, "/users?q="+options.query+"&from="+res.from);
    }, function(err) {
      _this.loading = false;
      _this.error = err.message;
      _this.reset([]);
    });

    return res;
  },
  fetchAdmins: function() {
    var _this = this;
    var req = this.sync("read", {}, {url: API_ROOT + "users/admins"});
    req.then(function(res) {
      _this.reset(res);
    });
    return req;
  },
  fetchBetaMailList: function() {
    var _this = this;
    var req = this.sync("read", {}, {url: API_ROOT + "users/beta_mail_list"});
    req.then(function(res) {
      _this.reset(res);
    });
    return req;
  }
});

module.exports = UserCollection;
