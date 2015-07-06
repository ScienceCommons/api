/** @jsx m */

"use strict";
require("./app.scss");

window.m = require("mithril");
var UserModel = require("./models/UserModel.js");
var GoogleAnalytics = require("./utils/GoogleAnalytics.js");
var OnUnload = require("./utils/OnUnload.js");

var App = {};

App.pages = {
  NotFound: require("./pages/NotFoundPage.js"),
  Admin: require("./pages/AdminPage.js"),
  About: require("./pages/AboutPage.js"),
  Article: require("./pages/ArticlePage.js"),
  Author: require("./pages/AuthorPage.js"),
  Bookmarks: require("./pages/BookmarksPage.js"),
  Home: require("./pages/HomePage.js"),
  Invite: require("./pages/InvitePage.js"),
  Login: require("./pages/LoginPage.js"),
  Logout: require("./pages/LogoutPage.js"),
  Profile: require("./pages/ProfilePage.js"),
  Search: require("./pages/SearchPage.js"),
  Signup: require("./pages/SignupPage.js")
};

window.App = App;
App.showPage = function(pageName) {
  var Page = {};

  Page.controller = function() {
    OnUnload(this);
    m.startComputation();

    if (!CS.user && App.user) {
      delete App.user;
    } else if (CS.user && !App.user) {
      App.user = new UserModel(CS.user);
      App.user.get("bookmarks").url = function() { return API_ROOT + "bookmarks"; };
      if (App.user.get("id")) {
        App.user.get("bookmarks").fetch();
      }
    }

    if (pageName === "Admin" && !App.user.get("admin")) {
      this.currentPage = App.pages["NotFound"];
      this.controllers.page = new this.currentPage.controller({user: App.user});
    } else if (App.user && pageName === "Login") {
      this.currentPage = App.pages["Home"];
      this.controllers.page = new this.currentPage.controller({user: App.user});
      m.route("/");
    } else {
      this.currentPage = App.pages[pageName];
      this.controllers.page = new this.currentPage.controller({user: App.user});
      GoogleAnalytics.TrackNavigation();
    }

    m.endComputation();
  };

  Page.view = function(ctrl) {
    return new ctrl.currentPage.view(ctrl.controllers.page);
  };

  return Page;
};

require("fastclick").attach(document.body);

window.location.hash = window.location.hash || "/";
m.route.mode = "hash";
m.route(document.getElementById("page"), "/not_found", {
  "/": App.showPage("Home"),
  "/query": App.showPage("Search"),
  "/query/": App.showPage("Search"),
  "/query/:query": App.showPage("Search"),
  "/profile": App.showPage("Profile"),
  "/articles/:articleId": App.showPage("Article"),
  "/authors/:authorId": App.showPage("Author"),
  "/login": App.showPage("Login"),
  "/about": App.showPage("About"),
  "/admin": App.showPage("Admin"),
  "/invite": App.showPage("Invite"),
  "/bookmarks": App.showPage("Bookmarks"),
  "/logout": App.showPage("Logout"),
  "/signup": App.showPage("Signup"),
  "/not_found": App.showPage("NotFound")
});

module.exports = App;
