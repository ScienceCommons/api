/** @jsx m */

"use strict";
require("./StudyFinder.scss");

var _ = require("underscore");
var m = require("mithril");
var SearchResults = require("./SearchResults.js");
var ArticleCollection = require("../collections/ArticleCollection.js");
var Spinner = require("./Spinner.js");
var cx = require("../utils/ClassSet.js");

var StudyFinder = {};

StudyFinder.controller = function(options) {
  this.search = m.prop("");
  this.submitted = m.prop(false);
  this.matchingArticles = new ArticleCollection();
  this.selectedArticle = null;
  this.selectStudy = options.selectStudy;
  this.parentStudy = options.parentStudy;


  var _this = this;
  this.selectArticle = function(article) {
    return function() {
      if (_this.selectedArticle === article) {
        _this.selectedArticle = null;
      } else {
        _this.selectedArticle = article;
        article.get("studies").fetch();
      }
    };
  };

  this.runSearch = function(e) {
    e.preventDefault();
    _this.submitted(true);
    _this.matchingArticles.search({query: _this.search()});
  };

  this.clickStudyButton = function(study) {
    return function() {
      _this.selectStudy(study);
    };
  };
};

StudyFinder.view = function(ctrl) {
  var content;
  if (false && ctrl.selectedArticle) {
    content = StudyFinder.articleView(ctrl, ctrl.selectedArticle);
  } else {
    content = StudyFinder.searchView(ctrl);
  }
  return (
    <div className="StudyFinder">
      {content}
    </div>
  );
};

StudyFinder.articleView = function(ctrl, article) {
  var studies = article.get("studies");
  var content;

  if (studies.loading) {
    var spinner = Spinner.view();
  }

  if (studies.length === 0 && !studies.loading) {
    content = (
      <div> This article has no studies. <a href={"#/articles/"+article.id}>Go to article</a> to add a study.</div>
    )
  } else if (studies.length > 0) {
    var parentReplications = false;
    if (ctrl.parentStudy && ctrl.parentStudy()) {
      parentReplications = ctrl.parentStudy().get("replications");
    }

    var list = studies.map(function(study) {
      var replicationActive = parentReplications && parentReplications.find(
	function(replication) {
          return replication.get("replicating_study_id") === study.get("id")
        })
      var classes = cx({
        btn: true,
        btn_subtle: true,
        active: replicationActive
      });

      var parentStudy = ctrl.parentStudy();

      if(studies.length == 1){
        var studyName = study.etAl(3) + " (" + study.get("year") + ")";
      } else {
        var studyName = study.get("number");
      }
      return (
        <li>
          <button type="button" className={classes} onclick={ctrl.clickStudyButton(study)}
	  title={(replicationActive ? "Remove " : "Add ") + study.etAl(3) + " (" + study.get("year") + ") " +
		 study.get("number") + " as a replication of " + parentStudy.etAl(3) + " (" + parentStudy.get("year") +
		 ") "+ parentStudy.get("number")}>
              <span className={replicationActive ? "glyphicon glyphicon-minus" : "glyphicon glyphicon-plus"}></span>
	      <span className="icon icon_replication"></span>
	      <span> {studyName}</span>
	  </button>
        </li>
      );
    });
    content = (
      <div>
        <h6>Studies</h6>
        <ul>{list}</ul>
      </div>
    );
  }

  return (
    <div className="articleView">
      {spinner}
      {content}
    </div>
  );
};

function route(path) {
  return function(e) {
    return m.route(path);
  };
};

StudyFinder.searchView = function(ctrl) {
  var articles = ctrl.matchingArticles;
  var results;
  if (!ctrl.submitted()) {
    results = "";
  } else if (articles.loading) {
    results = Spinner.view();
  } else if (articles.total === 0) {
    results = "No articles found"
  } else {
    var list = articles.map(function(article) {
      if (ctrl.parentStudy && ctrl.parentStudy().get("article_id") === article.get("id")) {
        return;
      }
      var arrow;
      if (ctrl.selectedArticle === article) {
        var expandedContent = StudyFinder.articleView(ctrl, article);
        arrow = <span className="icon icon_up_caret arrow"></span>;
      } else {
        arrow = <span className="icon icon_down_caret arrow"></span>;
      }

      if (article.get("journal_title")) {
        var journalTitle = "- " + article.get("journal_title");
      }

      return (
        <li className="article">
          <header onclick={ctrl.selectArticle(article)}>
            <div className="title">{article.get("title")}</div>
            <div className="authors">({article.get("year")}) {article.authors().etAl(3)} {journalTitle}</div>
            {arrow}
          </header>
          {expandedContent}
        </li>
      );
    });

    results = (
      <ul className="articles">
        {list}
      </ul>
    );
  }

  return (
    m("form", {onsubmit:ctrl.runSearch}, [
      m("div", {className:"search"}, [
        m("div", ["Find the article, then pick the study."]),
        m("input", {config:focusConfig, placeholder:"Find article", type:"text", value:ctrl.search(), oninput:m.withAttr("value", ctrl.search)} ),
        m("button", {type:"submit", className:"btn"}, ["Search"]),
        " ",
        m("span", {class:"glyphicon glyphicon-info-sign tooltip", title:"Find the article containing the replication study, and then click the \"Add replication\" icon next to the replication study you want to link to the original study. If the article containing the replication is missing, click the \"Add Article\" button to add a new article; once you’ve added the replication study, return to the original study article to add the replication (this process will be improved in the near future)."}),
        m("button", {type:"button", className:"btn", onclick:route("/articles/new")}, [
          m("span", {className:"glyphicon glyphicon-plus"}),
          m("span", [ " Add article"])
        ])
      ]),

      m("div", {className:"results"}, [
        results
      ])
    ])
  );
};

function focusConfig(el, isInitialized) {
  if (!isInitialized) {
    el.focus();
  }
}

module.exports = StudyFinder;
