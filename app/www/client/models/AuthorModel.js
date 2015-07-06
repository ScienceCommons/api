/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");

var AuthorModel = CurateBaseModel.extend({
  name: "Author",
  relations: ["ArticleCollection", function() {
    return {
      "articles": {type: "many", collection: require("../collections/ArticleCollection.js"), urlAction: "articles"}
    };
  }],
  defaults: {
    first_name: "",
    last_name: "",
    middle_name: "",
    orcid: "",
    job_title: "",
    affiliations: []
  },
  initialize: function() {
    _.bindAll(this, 'markDuplicate');
  },
  computeds: {
    fullName: {
      get: function() {
        return _.compact([this.get("first_name"), this.get("middle_name"), this.get("last_name")]).join(" ");
      },
      set: function(val) {
        var names = val.split(/\s+/);
        var first_name = "";
        var middle_name = "";
        var last_name = "";
        if (names.length === 1) {
          first_name = names[0];
        } else if (names.length === 2) {
          first_name = names[0];
          last_name = names[1];
        } else if (names.length === 3) {
          first_name = names[0];
          middle_name = names[1];
          last_name = names[2];
        } else if (names.length > 3) {
          first_name = names.shift();
          last_name = names.join(" ");
        }

        this.set({first_name: first_name, middle_name: middle_name, last_name: last_name});
      }
    }
  },
  pill: function() {
    return { label: this.get("fullName"), value: this };
  },
  urlRoot: "authors",
  markedDuplicate: function() {
    return !!this.get("same_as_id") && this.get("id") !== this.get("same_as_id");
  },
  markDuplicate: function(otherAuthor) {
    var oldVal = this.get("same_as_id");
    this.set("same_as_id", otherAuthor.get("id"));
    var req = this.sync("create", this, {data: {id: this.get("id"), same_as_id: this.get("same_as_id")}, url: this.url()+"/mark_duplicate"});
    var _this = this;
    req.then(function(data) {
      _this.set(data);
    }, function() {
      _this.set("same_as_id", oldVal);
    });
    return req;
  }
});

module.exports = AuthorModel;
