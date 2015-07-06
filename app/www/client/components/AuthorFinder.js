/** @jsx m */

"use strict";
require("./AuthorFinder.scss");

var _ = require("underscore");
var m = require("mithril");
var SearchResults = require("./SearchResults.js");
var AuthorCollection = require("../collections/AuthorCollection.js");
var Spinner = require("./Spinner.js");
var cx = require("../utils/ClassSet.js");

var AuthorFinder = {};

AuthorFinder.controller = function(options) {
  this.search = m.prop("");
  this.submitted = m.prop(false);
  this.matchingAuthors = new AuthorCollection();

  this.selectedAuthor = null;
  this.onSelect = function(author) {
    return function(e) {
      options.onSelect(author);
    };
  };
  this.parentAuthor = options.parentAuthor;

  var _this = this;
  this.selectAuthor = function(author) {
    return function() {
      if (_this.selectedAuthor === author) {
        _this.selectedAuthor = null;
      } else {
        _this.selectedAuthor = author;
        author.fetch({data: {include: ["articles"]}});
      }
    };
  };

  this.runSearch = function(e) {
    e.preventDefault();
    _this.submitted(true);
    _this.matchingAuthors.search({query: _this.search(), without: _this.parentAuthor});
  };
};

AuthorFinder.view = function(ctrl) {
  return (
    <div className="AuthorFinder">
      {AuthorFinder.searchView(ctrl)}
    </div>
  );
};

AuthorFinder.expandedAuthorView = function(ctrl, author) {
  if (author.loading) {
    var spinner = Spinner.view();
  } else {
    var selectButton = <button type="button" className="btn" onclick={ctrl.onSelect(author)}>Select</button>;

    var affiliations = _.map(author.get("affiliations"), function(affiliation) {
      return <li>{affiliation}</li>;
    });

    var articles = author.get("articles").map(function(article) {
      return <li>
        <header><a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a></header>
        <div className="authors">({article.get("year")}) {article.authors().etAl(3)}</div>
      </li>;
    });
  }

  return (
    <div className="articlesView">
      {spinner}
      {selectButton}
      <ul>{affiliations}</ul>
      <ul>{articles}</ul>
    </div>
  );
};

AuthorFinder.searchView = function(ctrl) {
  var authors = ctrl.matchingAuthors;
  var results;
  if (!ctrl.submitted()) {
    results = "";
  } else if (authors.loading) {
    results = Spinner.view();
  } else if (authors.total === 0) {
    results = "No authors found"
  } else {
    var list = authors.map(function(author) {
      var arrow;
      if (ctrl.selectedAuthor === author) {
        var expandedContent = AuthorFinder.expandedAuthorView(ctrl, author);
        arrow = <span className="icon icon_up_caret arrow"></span>;
      } else {
        arrow = <span className="icon icon_down_caret arrow"></span>;
      }

      if (author.get("job_title")) {
        var job_title = "("+author.get("job_title")+")";
      }

      return (
        <li className="authorView">
          <header onclick={ctrl.selectAuthor(author)}>
            <div className="name">{author.get("fullName")} {job_title}</div>
            {arrow}
          </header>
          {expandedContent}
        </li>
      );
    });

    results = (
      <ul className="authors">
        {list}
      </ul>
    );
  }

  return (
    <form onsubmit={ctrl.runSearch}>
      <div className="search">
        <input placeholder="Find author" type="text" value={ctrl.search()} oninput={m.withAttr("value", ctrl.search)} />
        <button type="submit" className="btn">Search</button>
      </div>

      <div className="results">
        {results}
      </div>
    </form>
  );
};

module.exports = AuthorFinder;
