/** @jsx m */

"use strict";
require("./AuthorList.scss");

var _ = require("underscore");
var m = require("mithril");

var AuthorModel = require("../models/AuthorModel.js");
var AuthorCollection = require("../collections/AuthorCollection.js");

var Typeahead = require("./Typeahead.js");
var PillList = require("./PillList.js");
var Popover = require("../components/Popover.js");
var Spinner = require("../components/Spinner.js");
var Modal = require("../components/Modal.js");

var AuthorList = {};

AuthorList.controller = function(options) {
  this.searchResults = new AuthorCollection();
  this.collection = options.collection;
  this.editable = options.editable;
  this.editingDenormalized = m.prop(false);
  if (options.isNewRecord){ 
    this.isNewRecord = options.isNewRecord;
  }
  var _this = this;
  this.controllers = {};
  this.controllers.Typeahead = new Typeahead.controller({
    collection: this.searchResults,
    submit: _.result(this, "collection").add, // need to add create options
    extras: [{
      label: "Add a new author",
      handleClick: function(val) {
        return function() {
          _this.newAuthor = new AuthorModel();
          _this.newAuthor.set("fullName", val);
          _this.controllers.CreateAuthorModal.open(true);
        };
      }
    }],
    recommendationView: function(author) {
      return (
        <div>
          <h4>{author.get("fullName")}</h4>
          <h6>{author.get("job_title")}</h6>
        </div>
      );
    }
  });

  this.controllers.CreateAuthorModal = new Modal.controller({
    className: "newAuthorModal"
  });

  this.controllers.PillList = new PillList.controller({
    typeahead: this.controllers.Typeahead,
    collection: this.collection, // authors
    editable: this.editable, 
    isNewRecord: this.isNewRecord
  });

  this.handleNewAuthorSubmit = function(e) {
    e.preventDefault();
    _this.newAuthor.save().then(function() {
      _this.controllers.Typeahead.clear();
      _.result(_this, "collection").reindex();
      _.result(_this, "collection").add(_this.newAuthor);
      _this.newAuthor = null;
      _this.editingDenormalized(false);
    }, function() {
      // error
    })
  };

  this.pillView = function(pill, options) {
    options = options || {};

    if (options.onRemoveClick) {
      var removeIcon = <span className="icon icon_removed" onclick={options.onRemoveClick(pill)}></span>
    }

    var author = pill.value;
    var popoverTitle;
    var popoverContent;

    if (author.get("id")) {
      popoverTitle = <a href={"/authors/"+author.get("id")} config={m.route}>{author.get("fullName")}</a>;
      var affiliations = _.map(author.get("affiliations"), function(affiliation) {
        return <li>{affiliation}</li>;
      });
      popoverContent = (
        <div>
          <h6>{author.get("job_title")}</h6>
          <ul className="affiliations">
            {affiliations}
          </ul>
        </div>
      );
    } else {
      if (_this.editingDenormalized() === author) {
        popoverContent = newAuthorForm(_this, author, {type: "denormalized", cancel: function() {
          author.reset();
          _this.newAuthor = null;
          _this.editingDenormalized(false);
        }});
      } else {
        popoverTitle = author.get("fullName");

        if (_this.editable()) {
          var addInformationButton = <button type="button" onclick={_this.handleDenormalizedAddInformation(author)}>Add information</button>;
        }
        popoverContent = (
          <div>
            <p>We do not have any data for this author.</p>
            {addInformationButton}
          </div>
        );
      }
    }
    return <li className="pill" config={Popover.configForView({title: popoverTitle, content: popoverContent, forceOpen: _this.editingDenormalized() === author})}>{pill.label} {removeIcon}</li>
  };

  this.handleDenormalizedAddInformation = function(author) {
    return function(e) {
      author.set("fullName", author.get("fullName"));
      _this.newAuthor = author;
      _this.editingDenormalized(author);
    };
  };
};

AuthorList.view = function(ctrl, options) {
  var author = ctrl.newAuthor;
  if (author) {
    if (author.hasErrors()) {
      var errors = _.map(author.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul className="errors">
        {errors}
      </ul>;
    }

    var createAuthorModal = Modal.view(ctrl.controllers.CreateAuthorModal, {
      label: "Add an author",
      content: newAuthorForm(ctrl, author)
    });
  }

  return <div className="AuthorList">
    {PillList.view(ctrl.controllers.PillList, _.extend({pillView: ctrl.pillView}, options))}
    {createAuthorModal}
  </div>;
};

module.exports = AuthorList;

// helpers

function newAuthorForm(ctrl, author, options) {
  options = options || {};
  if (author.hasErrors()) {
    var errors = _.map(author.errors(), function(error) {
      return <li>{error}</li>;
    });

    var errorMessage = <ul className="errors">
      {errors}
    </ul>;
  }

  if (options.cancel) {
    var cancelButton = <button type="button" className="btn" onclick={options.cancel}>Cancel</button>;
  }

  return <form onsubmit={ctrl.handleNewAuthorSubmit}>
    {errorMessage}
    <h3>
      <span placeholder="First name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("first_name"))}>{author.get("first_name")}</span>
      <span placeholder="Middle name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("middle_name"))}>{author.get("middle_name")}</span>
      <span placeholder="Last name here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("last_name"))}>{author.get("last_name")}</span>
    </h3>
    <h5 className="h5" placeholder="Job title here" contenteditable="true" oninput={m.withAttr("textContent", author.setter("job_title"))}>{author.get("job_title")}</h5>
    <button type="submit" className="btn">{options.type === "denormalized" ? "Save" : "Add author"}</button>
    {cancelButton}
  </form>;
};
