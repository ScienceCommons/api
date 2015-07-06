"use strict";

var _ = require("underscore");
var CurateBaseCollection = require("./CurateBaseCollection.js");

var SearchCollection = CurateBaseCollection.extend({
  name: "SearchCollection",
  types: {
    'Article': require("../models/ArticleModel.js"),
    'Author': require("../models/AuthorModel.js"),
  },
  initialize: function() {
    this.total = 0;
    this.loading = false;
  },
  search: function(options) {
    var url = API_ROOT + "beta/search?q=" + options.query;
    if (!_.isUndefined(options.from)) {
      url = url + "&from=" + options.from;
    }
    var _this = this;
    var t0 = _.now();
    this.loading = true;
    var res = this.sync("read", this, {url: url})
    res.then(function(res) {
      var t1 = _.now();
      _this.loading = false;
      _this.total = res.total;
      _this.from = res.from;
      _this.reset(res.documents);
      ga('send', 'timing', 'SearchCollection', 'Search', t1-t0, "/search?q="+options.query+"&from="+res.from);
    });

    return res;
  }
});

module.exports = SearchCollection;
