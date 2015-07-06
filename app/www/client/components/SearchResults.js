/** @jsx m */

"use strict";
require("./SearchResults.scss");

var _ = require("underscore");
var m = require("mithril");

var ArticleModel = require("../models/ArticleModel.js");
var ArticleCollection = require("../collections/SearchCollection.js");
var Spinner = require("./Spinner.js");
var Badge = require("./Badge.js");

var SearchResults = {};

SearchResults.controller = function(options) {
  options = options || {};
  this.user = options.user;
  this.results = new ArticleCollection([]);
  window.results = this.results;
  this.from = m.prop(0);
  this.resultsPerPage = m.prop(20);

  var _this = this;
  this.previousPage = function() {
    _this.from(Math.max(_this.from()-_this.resultsPerPage(), 0));
    _this.fetchResults();
  };

  this.nextPage = function() {
    _this.from(_this.from() + _this.resultsPerPage());
    _this.fetchResults();
  };

  this.fetchResults = function() {
    _this.results.search({query: m.route.param("query"), from: _this.from()});
  };

  this.fetchResults();
};

SearchResults.view = function(ctrl) {
  var content;

  if (ctrl.results.loading) {
    content = new Spinner.view();
  } else if (ctrl.results.total > 0) {
    content = <table><tbody>
      {ctrl.results.map(function(result) { return new SearchResults.itemViews[result.get("type")](result, ctrl.user); })}
    </tbody></table>;
  } else {
    content = <h3>Sorry, no results were found</h3>;
  }

  if (ctrl.results.total > 0) {
    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.results.total) {
      var more = (
        <div className="more">
          <button type="button" className="btn" onclick={ctrl.nextPage}>More results</button>
        </div>
      );
    }
  }

  return (
    <div className="SearchResults">
      {content}
      {more}
    </div>
  );
};

SearchResults.itemViews = {};

SearchResults.itemViews.Article = function(article, user) {
  if (article.get("journal_title")) {
    var journalTitle = "- " + article.get("journal_title");
  }
  return <tr className="searchResult">
    <td>
      <header>
        <a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a>
        <span className="pill">Article</span>
      </header>
      <div className="authors">
        <button type="button" className={"btn btn_subtle bookmark " + (user.hasBookmarked("Article", article.get("id")) ? "active" : "")} onclick={user.toggleBookmark("Article", article)}>
          <span className="icon icon_bookmark"></span>
        </button>
        ({article.get("year")}) {article.authors().etAl(3)} {journalTitle}
      </div>
    </td>
    <td></td>
  </tr>;
};

SearchResults.itemViews.Author = function(author, user) {
  var article_count = author.get("article_count") || 0;
  if (article_count > 0) {
    var article_count_text = article_count + " article" + (article_count > 1 ? "s" : "");
  }
  return <tr className="searchResult">
    <td>
      <header>
        <a href={"/authors/"+author.get("id")} config={m.route}>{author.get("fullName")}</a>
        <span className="pill">Author</span>
      </header>
      {article_count_text}
    </td>
    <td></td>
  </tr>;
};

module.exports = SearchResults;
