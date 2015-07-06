/** @jsx m */

"use strict";
require("./SearchPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var SearchResults = require("../components/SearchResults.js");
var Spinner = require("../components/Spinner.js");

var SearchPage = {};

SearchPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "SearchPage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.searchResults = new SearchResults.controller({user: options.user});
  this.sortBy = m.prop("relevance");
  var _this = this;
  this.setSort = function(sortBy) {
    return function(e) {
      _this.sortBy(sortBy);
    };
  }
};

function route(path) {
  return function(e) {
    return m.route(path);
  };
};

SearchPage.view = function(ctrl) {
  var results = ctrl.controllers.searchResults.results;
  var content;
  if (results.loading) {
    content = Spinner.view();
  } else {
    var count = "" + results.total + " Results";
    content = (
      <table className="filterAndResults">
        <thead>
          <tr>
            <th>
              {count}
              <div className="pull_right">
                <button type="button" className="btn" onclick={route("/articles/new")}>
                  <span className="glyphicon glyphicon-plus"></span>
                  <span> Add article</span>
                </button>
                &nbsp;
                <span class="glyphicon glyphicon-info-sign tooltip" title="Cannot find an article or replication? Click &quot;Add Article&quot; to add a missing article or replication."></span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {new SearchResults.view(ctrl.controllers.searchResults)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = SearchPage;
