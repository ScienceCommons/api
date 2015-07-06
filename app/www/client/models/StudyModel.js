/** @jsx m */

"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");
var LinkModel = require("./LinkModel.js");

var StudyModel = CurateBaseModel.extend({
  name: "Study",
  relations: {
    authors: {type: "many", collection: require("../collections/AuthorCollection.js")},
    links: {type: "many", model: LinkModel},
    comments: {type: "many", collection: require("../collections/CommentCollection.js"), urlAction: "comments"},
    model_updates: {type: "many", collection: require("../collections/ModelUpdatesCollection.js")},
    replications: {type: "many", model: require("./ReplicationModel.js"), urlAction: "replications"},
    replication_of: {type: "many", model: require("./ReplicationModel.js"), urlAction: "replication_of"}
  },
  defaults: {
    "authors": [],
    "independent_variables": [],
    "dependent_variables": [],
    "n": "",
    "power": "",
    "number": "",
    "effect_size": {},
    "badges": []
  },
  effectSizeKeyMap: {
    "d": "d",
    "eta": "η",
    "r": "r",
    "phi": "φ",
    "eta_sqr": "η²",
    "partial_eta_sqr": "partial η²"
  },
  computeds: {
    displayEffectSize: function() {
      var effectSize = this.get("effectSize");
      return _.compact([this.get("effectSizeMeasure"), this.get("effectSizeValue")]).join(" = ");
    },
    effectSizeMeasure: {
      get: function() {
        return this.effectSizeKeyMap[_.keys(this.get("effect_size"))[0]] || "";
      },
      set: function(measure) {
        var hash = {};
        hash[measure] = this.get("effectSizeValue");
        this.set("effect_size", hash);
      }
    },
    effectSizeValue: {
      get: function() {
        return _.values(this.get("effect_size"))[0] || "";
      },
      set: function(val) {
        var hash = {};
        hash[_.keys(this.get("effect_size"))[0]] = val;
        this.set("effect_size", hash);
      }
    },
    year: function() {
      if (this.get("article")) {
        return this.get("article").get("year");
      } else {
        var date = this.get("publication_date");
        if (date) {
          return date.substring(0,4)
        }
      }
    }
  },
  addReplication: function(replicationStudy) {
    if (this.get("article_id") !== replicationStudy.get("article_id")) {
      this.get("replications").add({
        article_id: this.get("article_id"),
        replicating_study_id: replicationStudy.get("id"),
        study_id: this.get("id"),
        replicating_study: replicationStudy
      }, {sync: true});
    }
  },
  removeReplication: function(replicationStudy) {
    var existing = this.get("replications").find(function(replication) { return replication.get("replicating_study_id") === replicationStudy.get("id"); });
    this.get("replications").remove(existing, {sync: true});
  },
  hasBadge: function(name) {
    if (this.get("links").length > 0) {
      return this.get("links").any(function(link) { return link.get("type") === name; });
    } else {
      return _.contains(this.get("badges"), name);
    }
  },
  commentable: function(field) {
    return _.contains(["independent_variables", "dependent_variables", "n", "power", "effect_size"], field);
  },
  hasPendingEdits: function(field) {
    return false;
  },
  urlRoot: "studies",
  create: function() {
    throw("Study.create must be done through the collection: article.get('studies')");
  },
  destroy: false, // Study.create must be done through the collection: article.get('studies')")
  linksByType: function(type) {
    return this.get("links").filter(function(link) {
      return link.get("type") === type;
    });
  },
  etAl: function(num) {
    return (this.get("article") ? this.get("article").authors() : this.get("authors")).etAl(num);
  }
});

module.exports = StudyModel;
