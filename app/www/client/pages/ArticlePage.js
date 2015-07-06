/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var Spinner = require("../components/Spinner.js");
var PillList = require("../components/PillList.js");
var AuthorList = require("../components/AuthorList.js");
var StudiesTable = require("../components/StudiesTable.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");
var AuthorModel = require("../models/AuthorModel.js");

var ArticlePage = {};

ArticlePage.controller = function(options) {
  OnUnload(this);
  var _this = this;
  this.user = options.user;
  if (m.route.param("articleId") === "new" && this.user.canEdit()) {
    this.article = new ArticleModel({});
    this.editing = m.prop(true);

  } else {
    this.article = new ArticleModel({id: m.route.param("articleId")});
    this.article.fetch();
    this.article.get("studies").fetch({data: {replications: true, comments: true, model_updates: true, replication_of: true, authors: true}});
    this.article.get("comments").fetch();
    this.editing = m.prop(false);
  }
  this.saving = m.prop(false);
  this.finding = m.prop(false);
  window.article = this.article;
  options = _.extend({id: "ArticlePage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.commentBox = new CommentBox.controller({comments: this.article.get("comments"), user: this.user});
  this.controllers.studiesTable = new StudiesTable.controller({article: article, user: this.user});

  this.controllers.tagsList = new PillList.controller({
    editable: this.editing,
    model: this.article,
    isNewRecord: this.article.isNew()
  });

  this.controllers.authorsList = new AuthorList.controller({
    editable: this.editing,
    collection: this.article.authors,
    isNewRecord: this.article.isNew()
  });

  this.editClick = function() {
    if (_this.user.canEdit()) {
      _this.editing(true);
    }
  };

  this.deleteClick = function() {
    var confirmation = confirm("This will permanently delete the article");
    if (confirmation) {
      _this.saving(true);
      _this.article.destroy().then(function() {
        _this.saving(false);
        m.route("/");
      }, function(err) {
        _this.saving(false);
      });
    }
  };

  this.saveClick = function() {
    _this.saving(true);
    var res = _this.article.save({include: ["authors"]});
    res.then(function() {
      _this.saving(false);
      _this.editing(false);
      m.redraw();
    }, function() {
      _this.saving(false);
      if (!_this.article.hasErrors()) {
        _this.editing(false);
      }
      m.redraw();
    });
    if (_this.article.isNew()) {
      res.then(function() {
        if (!_this.article.isNew()) {
          m.route("/articles/" + _this.article.get("id"));
        }
      });
    }
  };

  this.findClick = function() {
   _this.article.find_doi();
   document.getElementsByClassName('button_save')[0].focus();
   return false;
  };


  this.discardClick = function() {
    if (_this.article.isNew()) {
      m.route("/articles/new");
    } else {
      _this.article.reset({include: ["authors"]});
      _this.editing(false);
      _this.saving(false);
      _this.finding(false);
    }
  };

  this.onTabSendToAuthor = function(event) {
      var keyCode = event.keyCode;
      if(keyCode == '9'){
        if (typeof document.getElementsByClassName('icon_add')[0] !== 'undefined') {
          event.preventDefault();
          document.getElementsByClassName('icon_add')[0].click();
          return false;
        }
      }
  };
  this.onTabSendToAbstract = function(event) {
      var keyCode = event.keyCode;
      if(keyCode == '9'){
        if (typeof document.getElementsByClassName('icon_add')[0] !== 'undefined') {
          event.preventDefault();
          document.getElementsByClassName('icon_add')[0].click();
          return false;
        }
      }
  };

  this.focusDOI = function(el, isInitialized) {
    if (!isInitialized) {
      document.getElementsByClassName('form_field')[0].focus();
    }
  };

  this.onEnterDoiFind = function(event) {
    var keyCode = event.keyCode;
    if(keyCode == '13'){
      _this.article.find_doi();
      document.getElementsByClassName('button_save')[0].focus();
      event.preventDefault();
      return false;
    }
  };
};

ArticlePage.view = function(ctrl) {
  var article = ctrl.article;
  var content;
  if (article) {
    document.title = _.compact([
      article.authors().etAl(1),
      article.get("journal"),
      article.get("year")
    ]).join(", ");

    if (!article.loading) {
      if (article.isNew()) {
        var tags = new PillList.view(ctrl.controllers.tagsList, { placeholder: "(Optional)" });
        var authors = new AuthorList.view(ctrl.controllers.authorsList, { placeholder: "(Required, at least one)" });
      } else {
        var tags = new PillList.view(ctrl.controllers.tagsList);
        var authors = new AuthorList.view(ctrl.controllers.authorsList, { placeholder: "No authors" });
      }
    }

    if (ctrl.user && ctrl.user.canEdit()) {
      var editButtons;
      var bookmarkButton;
      var findDoiButton;
      var doiLabel;
      var authorLabel;
      var yearLabel;
      var titleLabel;
      var journalLabel;
      var abstractLabel;
      var requireLabel;
      var tagLabel;
      if (ctrl.editing()) {
        editButtons = [
          m("button", {type:"button", className:"btn", key:"save", onclick:ctrl.saveClick, disabled:ctrl.saving()}, [ctrl.saving() ? "Saving..." : "Save"]),
          m("button", {type:"button", className:"btn", key:"discard", onclick:ctrl.discardClick, disabled:ctrl.saving()}, ["Discard"]),
        ];
        findDoiButton = m("button", {type:"button", className:"btn", key:"find", onclick:ctrl.findClick, disabled:ctrl.finding(), onkeydown:ctrl.onTabSendToAuthor}, [ctrl.finding() ? "Finding..." : "Retrieve article metadata"]);
        doiLabel = (
          m("h3", {className:"label"}, ["DOI:"])
        );
        authorLabel = (
          m("h3", {className:"label"}, ["Author(s)*:"])
        );
        yearLabel = (
          m("h3", {className:"label"}, ["Publication Year*:"])
        );
        titleLabel = (
          m("h3", {className:"label"}, ["Article title*:"])
         );
        journalLabel = (
          m("h3", {className:"label"}, ["Journal name:"])
        );
        abstractLabel = (
          m("h3", {className:"label"}, ["Abstract:"])
        );
        requireLabel = (
          m("p",{className:"require_label"}, ["*=required field."])
        );
        tagLabel = (
          m("h3", {className:"label", placeholder:"(Optional)"}, ["Tags:"])
        );
      } else {
        editButtons = [
          m("button", {type:"button", className:"btn", key:"edit", onclick:ctrl.editClick}, ["Edit"]),
          m("button", {type:"button", className:"btn", key:"delete", onclick:ctrl.deleteClick}, ["Delete"]),
        ];
      }
       bookmarkButton = (
         <button type="button" key="bookmark" title="Bookmark article" className={"btn bookmark " + (ctrl.user && ctrl.user.hasBookmarked("Article", article.get("id")) ? "active" : "")} onclick={ctrl.user.toggleBookmark("Article", article)}><span className="icon icon_bookmark"></span></button>
       );
    }

    var studiesTable, commentsList;
    if (article.isNew()) {
      studiesTable = m("h5", ["You must save this new article before you can add studies."]);
      commentsList = m("h5", ["You must save this new article before you can leave comments."]);
    } else {
      studiesTable = new StudiesTable.view(ctrl.controllers.studiesTable);
      commentsList = new CommentBox.view(ctrl.controllers.commentBox);
    }

    if (article.hasErrors()) {
      var errors = _.map(article.errors(), function(error) {
        return m("li", [error]);
      });

      var errorMessage = m("ul", {className:"errors"}, [
        errors
      ]);
    }
    if (ctrl.article.isNew()){
     content = (
      <div>
        <h2 className="text_center">Add a missing or unpublished article&nbsp;<span class="glyphicon glyphicon-info-sign tooltip" title="For missing published or in press articles, drag-and-drop or copy-and-paste the DOI and hit ENTER or click the &quot;Retrieve article metadata&quot; button to automatically retrieve article metadata. For unpublished articles or articles without a DOI, manually input the Authors, Publication year, and Article title, and click Save."></span></h2>
        {errorMessage}
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <div className="doi">
              {doiLabel}
              <p className="field form_field" placeholder="(Optional) Input DOI &amp; hit Enter" config={ctrl.focusDOI} contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("doi"))} onkeydown={ctrl.onEnterDoiFind}>{article.get("doi")}</p>
              <p className="btn_group button_find">{findDoiButton}</p>
            </div>
            <h3 className="label">
              <span class="glyphicon glyphicon-info-sign tooltip" title="To add an author, click the &quot;+&quot; icon and start typing the author’s first name and select the relevant author’s name if it already exists. If an author’s name is missing, click &quot;Add a new author&quot; to manually input the author’s first, middle, and last name."></span>&nbsp;
              Author(s)*:
            </h3>
            <div className="authors form_field">
              {authors}
            </div>
            <div className="year">
              {yearLabel}
              <p className="field form_field" placeholder="(Required, YYYY format)" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.customSetter("publication_date",function(x){return x + "-01-01";}))}>{article.get("publication_date").substring(0,4)}</p>
            </div>
            <div className="title">{titleLabel}
              <p className="form_field field" placeholder="(Required)" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("title"))}>{article.get("title")}</p>
            </div>
            <div className="journal">
              {journalLabel}
              <p className="form_field field" placeholder="(Optional) If unpublished, leave blank" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("journal_title"))}>{article.get("journal_title")}</p>
            </div>
            {abstractLabel}
            <p className="abstract form_field" placeholder="(Optional)" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("abstract"))} onkeydown={ctrl.onTabSendToAbstract}>{m.trust(convertToLinks(article.get("abstract")))}</p>
            <div className="tags" >
              {tagLabel}
              <p className="form_field add_tags">
                {tags}
              </p>
            </div>
            <button type="button" className="btn button_save" onclick={ctrl.saveClick} disabled={ctrl.saving()}>{ctrl.saving() ? "Saving..." : "Save"}</button>
            <button type="button" className="btn button_discard" onclick={ctrl.discardClick} disabled={ctrl.saving()}>{"Discard"}</button>
            {requireLabel}
          </div>
        </div>
      </div>
    );
    } else {
     content = (
        <div>
          {errorMessage}
          <div className="section articleHeader">
            <div className="col span_3_of_4 titleAndAbstract">
              <h2 className="articleTitle" placeholder="Title goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("title"))}>{article.get("title")}</h2>
              <div className="year">
          <p className="field" placeholder="YYYY format" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.customSetter("publication_date",function(x){return x + "-01-01";}))}>{article.get("publication_date").substring(0,4)}</p>
              </div>
              <div className="authors">{authors}</div>

              <h3>Abstract</h3>
              <p className="abstract" placeholder="Abstract goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("abstract"))}>{m.trust(convertToLinks(article.get("abstract")))}</p>
            </div>

            <div className="col span_1_of_4 text_right">
              <div className="btn_group">
                {editButtons}
                {bookmarkButton}
              </div>

              <div className="journal">
                <h5>Journal</h5>
                <p className="field" placeholder="Journal goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("journal_title"))}>{article.get("journal_title")}</p>
              </div>
              <div className="doi">
                <h5>DOI</h5>
                <p className="field" placeholder="DOI goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("textContent", article.setter("doi"))}>{article.get("doi")}</p>
              </div>
              <div className="tags">
                <h5>Tags</h5>
                <p>{tags}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>
              Studies and replications
              &nbsp;
              <span class="glyphicon glyphicon-info-sign tooltip-top" title="Add original studies of current article by clicking &quot;Add study&quot;. Add a replication study to an original study by clicking the &lt;span class=&quot;subway_add_icon&quot;&gt;&lt;/span&gt; icon above the corresponding study."></span>
            </h3>
            {studiesTable}
          </div>

          <div className="section">
            <div className="col span_4_of_4">
              <div>
                <h3>Comments</h3>
                {commentsList}
              </div>
            </div>
          </div>
        </div>
      );
    }

  } else {
    if (ctrl.article.hasErrors()) {
      var errorsList = _.map(ctrl.article.errors(), function(message) {
        return m("li", [message]);
      });
      content = m("ul", {className:"errors"}, [m("li", [errorsList])]);
      // contents.push(m("ul", {className:"errors"}, [errorsList]));
    }
  }

  return new Layout.view(ctrl.controllers.layout, content);
};


// helpers
function toggleBookmark(article, user) {
  if (ctrl.user){
    return function(e) {
      var bookmark = user.hasBookmarked("Article", article.get("id"));
      if (bookmark) {
        return user.get("bookmarks").remove(bookmark, {sync: true});
      } else {
        return user.get("bookmarks").add({bookmarkable_type: "Article", bookmarkable_id: article.get("id")}, {sync: true});
      }
    };
  } else {
    return undefined;
  }
};


function convertToLinks(text) {
  var replaceText, replacePattern1, replacePattern2, replacedText;

  //URLs starting with http://, https://
  replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
  replacedText = text.replace(replacePattern1, '<a title="$1" href="$1" target="_blank">$1</a>');

  //URLs starting with "www."
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  //returns the text result

  return replacedText;
}


module.exports = ArticlePage;
