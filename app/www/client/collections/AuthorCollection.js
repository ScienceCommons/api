"use strict";

var _ = require("underscore");
var m = require("mithril");
var CurateBaseCollection = require("./CurateBaseCollection.js");

var AuthorCollection = CurateBaseCollection.extend({
  name: "AuthorCollection",
  model: require("../models/AuthorModel.js"),
  initialize: function() {
    _.bindAll(this, "search");
  },
  authorLastNames: function() {
    var lastNames = this.authorLastNamesList();
    if (lastNames.length > 1) {
      return _.first(lastNames, lastNames.length-1).join(", ") + " & " + _.last(lastNames);
    } else if (lastNames.length == 1) {
      return _.first(lastNames);
    }
  },
  authorLastNamesList: function() {
    return this.map(function(model){
      return model.get('last_name');
    });
  },
  etAl: function(num) {
    num = num || 1;
    if (this.length > 0) {
      if (this.length === 1) {
        return this.first().get("last_name");
      } else if (this.length > num) {
        return _.map(this.first(num), function(author) { return author.get("last_name"); }).join(", ") + " et al.";
      } else {
        return _.map(this.first(this.length - 1), function(author) { return author.get("last_name"); }).join(", ") + " & " + this.last().get("last_name");
      }
    }
  },
  search: function(options) {
    var query = options.query;
    if (_.isEmpty(query)) {
      this.reset([]);
      return;
    }

    if (options.partial) {
      query = "*" + query + "*";
    }
    var url = API_ROOT + "authors?q=" + query;
    if (!_.isUndefined(options.from)) {
      url = url + "&from=" + options.from;
    }
    var _this = this;
    var t0 = _.now();
    this.loading = true;
    var XHRid = _.uniqueId();
    this._searchXHRid = XHRid;
    var res = this.sync("read", this, {url: url});
    res.then(function(res) {
      var t1 = _.now();
      if (XHRid === _this._searchXHRid) { // otherwise there is a new xhr
        _this.loading = false;
        _this.total = res.total;
        _this.from = res.from;
        _this.reset(res.documents);
        if (options.without) {
          var model = _this.get(options.without.get("id"));
          if (model) {
            _this.remove(model);
          }
        }
      }
      ga('send', 'timing', 'AuthorCollection', 'Search', t1-t0, "/authors?q="+query+"&from="+res.from);
    });

    m.redraw();
    return res;
  }
});

module.exports = AuthorCollection;
