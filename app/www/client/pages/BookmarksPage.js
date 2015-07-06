/** @jsx m */

"use strict";
require("./BookmarksPage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var BookmarksPage = {};

BookmarksPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "BookmarksPage"}, options);
  this.user = options.user;
  if (this.user.get("id")) {
    this.user.get("bookmarks").fetch();
  }
  this.controllers.layout = new Layout.controller(options);
};

BookmarksPage.view = function(ctrl) {
  var content;
  var bookmarks = ctrl.user.get("bookmarks");

  if (bookmarks.length > 0) {
    var list = bookmarks.map(function(bookmark) {
      return BookmarksPage.views[bookmark.get("bookmarkable_type")](bookmark.get("bookmarkable"), ctrl.user);
      // return <li><a href={"/articles/"+bookmark.get("bookmarkable_id")} config={m.route}>{bookmark.get("bookmarkable_id")}</a></li>;
    });

    content = (
      <div>
        <h1>Bookmarks</h1>
        <ul className="bookmarks">
          {list}
        </ul>
      </div>
    );
  } else {
    content = (
      <div>
        <h1>Bookmarks</h1>
        <p>You do not have any bookmarks</p>
      </div>
    );
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

BookmarksPage.views = {};

BookmarksPage.views.Article = function(article, user) {
  return <li className="bookmark articleBookmark">
    <header><a href={article.url().replace(window.location.origin, "")} config={m.route}>{article.get("title")}</a></header>
    <div className="authors">
      <button type="button" className={"btn btn_subtle bookmark " + (user.hasBookmarked("Article", article.get("id")) ? "active" : "")} onclick={user.toggleBookmark("Article", article)}>
        <span className="icon icon_bookmark"></span>
      </button>
      ({article.get("year")}) {article.authors().etAl(3)}
    </div>
  </li>;
};

module.exports = BookmarksPage;
