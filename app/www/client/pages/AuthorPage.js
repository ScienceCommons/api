/** @jsx m */

"use strict";
require("./AuthorPage.scss");

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var ListEditor = require("../components/ListEditor.js");
var AuthorFinder = require("../components/AuthorFinder.js");
var AuthorModel = require("../models/AuthorModel.js");
var Modal = require("../components/Modal.js");

var AuthorPage = {};

AuthorPage.controller = function(options) {
  options = _.extend({id: "AuthorPage"}, options);
  OnUnload(this);
  this.user = options.user;
  this.editing = m.prop(false);
  this.saving = m.prop(false);

  if (m.route.param("authorId") === "new" && this.user && this.user.canEdit()) {
    this.author = new AuthorModel({});
    this.editing(true);
  } else {
    this.author = new AuthorModel({id: m.route.param("authorId")});
    this.author.fetch();
    this.author.get("articles").fetch();
  }
  window.author = this.author;

  var _this = this;
  this.controllers.layout = new Layout.controller(options);
  this.controllers.affiliationList = new ListEditor.controller({
    editing: _this.editing,
    items: function(val) {
      if (_.isUndefined(val)) {
        return _this.author.get("affiliations") || [];
      } else {
        _this.author.set("affiliations", val);
      }
    }
  });

  var oldUnload = this.onunload;
  this.onunload = function(e) {
    if (_this.author.hasChanges()) {
      if (!confirm("You have unsaved changes on this author.  Do you wish to navigate away without saving?")) {
        return e.preventDefault();
      }
    }
    oldUnload.call(_this);
  };

  this.markDuplicate = function(otherAuthor) {
    if (confirm("Mark this author as a duplicate. This action cannot be undone.")) {
      _this.author.markDuplicate(otherAuthor);
    }
  };

  this.controllers.duplicateAuthorsFinder = new AuthorFinder.controller({
    onSelect: this.markDuplicate,
    parentAuthor: _this.author
  });
  this.controllers.duplicateAuthorsFinderModal = new Modal.controller();

  this.editClick = function() {
    if (_this.user.canEdit()) {
      _this.editing(true);
    }
  };

  this.saveClick = function() {
    _this.saving(true);
    var res = _this.author.save();
    res.then(function() {
      _this.saving(false);
      _this.editing(false);
      m.redraw();
    }, function() {
      _this.saving(false);
      if (!_this.author.hasErrors()) {
        _this.editing(false);
      }
      m.redraw();
    });
    if (_this.author.isNew()) {
      res.then(function() {
        if (!_this.author.isNew()) {
          m.route("/authors/" + _this.author.get("id"));
        }
      });
    }
  };

  this.discardClick = function() {
    if (_this.author.isNew()) {
      m.route("/authors/new");
    } else {
      _this.author.set(_this.author._serverState);
      _this.editing(false);
      _this.saving(false);
    }
  };

  this.deleteClick = function() {
    var confirmation = confirm("This will permanently delete the author");
    if (confirmation) {
      _this.saving(true);
      _this.author.destroy().then(function() {
        _this.saving(false);
        m.route("/");
      }, function(err) {
        _this.saving(false);
      });
    }
  };

  this.markAsDuplicateClick = function() {
    _this.controllers.duplicateAuthorsFinderModal.open(true);
  };
};

AuthorPage.view = function(ctrl) {
  var author = ctrl.author;
  var content;

  if (author.loading) {
    content = Spinner.view();
  } else if (author.not_found) {
    content = content = <ul className="errors"><li>Author not found</li></ul>;
  } else {
    if (author.hasErrors()) {
      var errors = _.map(author.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul className="errors">{errors}</ul>;
    }

    var articles = author.get("articles");
    var articlesContent;
    if (articles.loading) {
      articlesContent = Spinner.view();
    } else if (articles.length > 0) {
      articlesContent = (
        <div>
          <h3>{articles.length} Article{articles.length > 1 ? "s" : ""}</h3>
          <ul>
            {articles.map(function(article) { return AuthorPage.articleView(article, ctrl.user); })}
          </ul>
        </div>
      );
    }

    if (ctrl.user && ctrl.user.canEdit() && !author.markedDuplicate()) {
      var editButtons;
      if (ctrl.editing()) {
        editButtons = [
          <button type="button" className="btn" key="save" onclick={ctrl.saveClick} disabled={ctrl.saving()}>{ctrl.saving() ? "Saving..." : "Save"}</button>,
          <button type="button" className="btn" key="discard" onclick={ctrl.discardClick} disabled={ctrl.saving()}>Discard</button>,
        ];
      } else {
        editButtons = [
          <button type="button" className="btn" key="edit" onclick={ctrl.editClick}>Edit</button>,
          <button type="button" className="btn" key="delete" onclick={ctrl.deleteClick}>Delete</button>,
        ]
      }
    }

    if (author.markedDuplicate()) {
      var alerts = <ul className="errors">
        <li>This author is a duplicate.  Please reference the <a href={"/authors/"+author.get("same_as_id")} config={m.route}>primary author</a>.</li>
      </ul>;
    }

    var name;
    if (ctrl.editing()) {
      name = [
        <span placeholder="First name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("first_name"))}>{author.get("first_name")}</span>,
        <span placeholder="Middle name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("middle_name"))}>{author.get("middle_name")}</span>,
        <span placeholder="Last name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("last_name"))}>{author.get("last_name")}</span>,
      ];
    } else {
      name = author.get("fullName");
    }

    if (ctrl.controllers.duplicateAuthorsFinderModal.open()) {
      var duplicateAuthorsFinder = new Modal.view(ctrl.controllers.duplicateAuthorsFinderModal, {
        label: "Find duplicate author",
        content: new AuthorFinder.view(ctrl.controllers.duplicateAuthorsFinder)
      });
    }

    var duplicateButton;
    if (ctrl.user) {
        duplicateButton = <button type="button" className="btn" disabled={author.markedDuplicate()} key="markDuplicate" onclick={ctrl.markAsDuplicateClick}>{author.markedDuplicate() ? "Marked" : "Mark"} as duplicate</button>;
    } else {
      duplicateButton = "";
    }
    content = (
      <div>
        <div className="btn_group authorControls">
          {editButtons}
          {duplicateButton}
        </div>

        {alerts}
        {errorMessage}
        <h2 className="h2">{name}</h2>
        <h5 className="h5" placeholder="Job title here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", author.setter("job_title"))}>{author.get("job_title")}</h5>
        <div className="affiliations">
          <h4>Affiliations{(author.get("affiliations")||[]).length === 0 ? ": Unknown" : ""}</h4>
          {ListEditor.view(ctrl.controllers.affiliationList, {placeholder: "Add an affiliation"})}
        </div>

        <div className="articlesContent">
          {articlesContent}
        </div>
        {duplicateAuthorsFinder}
      </div>
    );
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

AuthorPage.articleView = function(article, user) {
  var bookmarkButton;
  if (user){
      bookmarkButton = <button type="button" className={"btn btn_subtle bookmark " + (user.hasBookmarked("Article", article.get("id")) ? "active" : "")} onclick={user.toggleBookmark("Article", article)}>
        <span className="icon icon_bookmark"></span>
      </button>;
  } else {
    bookmarkButton = "";
  }

  return <div>
    <header><a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a></header>
    <div className="authors">
      {bookmarkButton}
      ({article.get("year")}) {article.authors().etAl(3)}
    </div>
  </div>;
};

module.exports = AuthorPage;
