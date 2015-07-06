/** @jsx m */

"use strict";
require("./ProfilePage.scss");

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var CommentList = require("../components/CommentList.js");

var ProfilePage = {};

ProfilePage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "ProfilePage"}, options);
  this.user = options.user;
  this.editing = m.prop(false);
  this.user.get("comments").fetch();

  this.controllers.layout= new Layout.controller(options);
  this.controllers.commentList = new CommentList.controller({user: this.user, comments: this.user.get("comments"), reply: true});

  var _this = this;
  this.editClick = function() {
    _this.editing(true);
  };

  this.saveClick = function() {
    _this.user.save();
    _this.editing(false);
  };

  this.discardClick = function() {
    _this.user.set(_this.user._serverState);
    _this.editing(false);
  };
};

ProfilePage.detailsView = function(ctrl, user) {
  var areasOfStudy = _.map(user.get("areas_of_study"), function(area) {
    return <div className="section">{area}</div>;
  });

  return (
    <div className="details">
      <h1 className="h1 section" placeholder="Name goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", user.setter("name"))}>{user.get("name")}</h1>
      <h3 className="h3 section">{user.get("email")}</h3>
    </div>
  );
};

ProfilePage.articlesView = function(user) {
  var content;
  if (user.get("articles").length === 0) {
    content = (
      <p>
        You have no articles. You can link articles by searching for them and then requesting to be linked.
      </p>
    );
  } else {
    var list = _.map(user.get("articles"), function(article) {
      return <li>{article.title}</li>;
    });
    content = <ul>{list}</ul>;
  }

  return (
    <div className="articles">
      <h3>Articles</h3>
      {content}
    </div>
  );
};

ProfilePage.commentsView = function(ctrl) {
  return (
    <div>
      <h3>Your comments</h3>
      {new CommentList.view(ctrl.controllers.commentList)}
    </div>
  );
};

ProfilePage.view = function(ctrl) {
  var user = ctrl.user;

  var editButtons;
  if (ctrl.editing()) {
    editButtons = [
      <button type="button" className="btn" key="save" onclick={ctrl.saveClick}>Save</button>,
      <button type="button" className="btn" key="discard" onclick={ctrl.discardClick}>Discard</button>,
    ];
  } else {
    editButtons = <button type="button" className="btn" key="edit" onclick={ctrl.editClick}>Edit</button>;
  }

  var content = (
    <div className="section">
      <div className="col span_1_of_2">
        {ProfilePage.detailsView(ctrl, ctrl.user)}
        {ProfilePage.articlesView(ctrl.user)}
      </div>
      <div className="col span_1_of_2">
        {ProfilePage.commentsView(ctrl)}
      </div>
      <div className="btn_group editButtons">
        {editButtons}
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = ProfilePage;
