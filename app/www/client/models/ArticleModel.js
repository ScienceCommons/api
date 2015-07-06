"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");

var ArticleModel = CurateBaseModel.extend({
  name: "Article",
  relations: {
    "authors_denormalized": {type: "many", collection: require("../collections/AuthorCollection.js")},
    "authors": {type: "many", collection: require("../collections/AuthorCollection.js")},
    "comments": {type: "many", collection: require("../collections/CommentCollection.js"), urlAction: "comments"},
    "studies": {type: "many", collection: require("../collections/StudyCollection.js"), urlAction: "studies", inverseOf: "article"},
    "recent_updated_by_author": {type: "one", model: require("./AuthorModel.js")}
  },
  defaults: {
    "title": "",
    "abstract": "",
    "tags": [],
    "badges": [],
    "doi": "",
    "publication_date": "",
    "journal": "",
    /*"comments": [
      {
        "anonymous": true,
        "date": "4-1-2014",
        "comment": "Blah",
        "replies": [
          {
            "author": {first_name: "Stephen", last_name: "Demjanenko"},
            "date": "4-1-2014",
            "comment": "Try to leave useful comments.  Thanks!"
          }
        ]
      },
      {
        "author": {first_name: "Stephen", last_name: "Demjanenko"},
        "date": "4-1-2014",
        "comment": "Im gonna see if I can replicate it"
      }
    ],
    "studies": [
      {
        "id": "1",
        "authors": "Zhong et al.",
        "badges": ["data", "materials", "registration", "disclosure"],
        "closed": true, // for testing the replication graph
        "replications": [
          {"id": "2", "authors": "Feng et al."},
          {"id": "3", "authors": "Wong et al."}
        ],
        "independentVariablesComments": [
          {
            "anonymous": true,
            "date": "4-1-2014",
            "comment": "Blah",
            "replies": [
              {
                "author": {first_name: "Stephen", last_name: "Demjanenko"},
                "date": "4-1-2014",
                "comment": "Try to leave useful comments.  Thanks!"
              }
            ]
          },
          {
            "author": {first_name: "Stephen", last_name: "Demjanenko"},
            "date": "4-1-2014",
            "comment": "Im gonna see if I can replicate it"
          }
        ]
      }, {
        "id": "4",
        "authors": "Zhong et al.",
        closed: true,
        "replications": [
          {
            "id": "5",
            "authors": "Schwarmer et al.",
            "dependentVariablesComments": [
              {
                "anonymous": true,
                "date": "4-1-2014",
                "comment": "Blah",
                "replies": [
                  {
                    "author": {first_name: "Stephen", last_name: "Demjanenko"},
                    "date": "4-1-2014",
                    "comment": "Try to leave useful comments.  Thanks!"
                  }
                ]
              },
              {
                "id": "6",
                "author": {first_name: "Stephen", last_name: "Demjanenko"},
                "date": "4-1-2014",
                "comment": "Im gonna see if I can replicate it"
              }
            ]
          }
        ]
      }, {
        "id": "7",
        "authors": "Zhong et al."
      }
    ],*/
    "action_editor": "",
    "reviewers": []
  },
  initialize: function(data, options) {
    _.bindAll(this, "bookmark", "authors", "find_doi");
  },
  urlRoot: "articles",
  computeds: {
    reviewersStr: {
      set: function(val) {
        this.set("reviewers", val.split(/\n/));
      }
    },
    year: function() {
      var date = this.get("publication_date");
      if (date) {
        return date.substring(0,4)
      }
    }
  },
  bookmark: function(remove) {
    this.sync(remove ? "delete" : "create", this, {
      data: {id: this.get("id")},
      url: this.url() + "/bookmark"
    });
  },
  hasBadge: function(name) {
    if (this.get("studies").length > 0) {
      return this.get("studies").all(function(study) { return study.hasBadge(name); });
    } else {
      return _.contains(this.get("badges"), name);
    }
  },
  authors: function() {
    if (this.get("authors").length === 0 && this.get("authors_denormalized").length > 0) {
      return this.get("authors_denormalized");
    }
    return this.get("authors");
  },
  find_doi:  function() {
    var req = this.sync("create", this, {data: {doi: this.get("doi"), year: this.get("publication_date"), title: this.get("title")}, url: API_ROOT + "articles/find_doi"}); //API_ROOT + this.urlRoot
    var _this = this;
    req.then(function(data) {
      _this.set(data);
    }, function() {
      _this.errors;
    });
    return req;
    }
});

module.exports = ArticleModel;
