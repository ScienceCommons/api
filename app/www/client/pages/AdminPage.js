/** @jsx m */

"use strict";
require("./AdminPage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");
var UserCollection = require("../collections/UserCollection.js");
var Spinner = require("../components/Spinner.js");
var User = require("../models/UserModel.js");

var AdminPage = {};

AdminPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AdminPage"}, options);
  this.user = options.user;
  this.controllers.layout = new Layout.controller(options);

  this.admins = new UserCollection([]);
  this.admins.fetchAdmins();
  this.betaMailList = new UserCollection([]);
  this.betaMailList.fetchBetaMailList();
  this.users = new UserCollection([]);
  this.query = m.prop("");
  this.dbStatsLoading = m.prop(true);
  this.dbStats = m.request({method: "GET", url: "/admin/db_stats", background: true});

  var _this = this;
  this.dbStats.then(function() {
    _this.dbStatsLoading(false);
    m.redraw();
  });

  this.findUser = function(e) {
    e.preventDefault();
    _this.users.search({query: _this.query()});
  };

  this.inviteBetaUser = function(user) {
    return function(e) {
      user.save();
    };
  };
};

AdminPage.view = function(ctrl) {
  var searchResults;
  if (ctrl.query()) {
    if (ctrl.users.loading) {
      searchResults = Spinner.view();
    } else if (ctrl.query() === ctrl.users.query) {
      if (ctrl.users.error) {
        searchResults = "Error: " + ctrl.users.error;
      } else if(ctrl.users.length > 0) {
        searchResults = userActionTable(ctrl, ctrl.users);
      }
    }
  }

  var betaRows = ctrl.betaMailList.map(function(user) {
    return <tr>
      <td>{user.get("email")}</td>
      <td>
        <button type="button" onclick={ctrl.inviteBetaUser(user)} disabled={!!user.get("id")}>
          {user.get("id") ? "Invited" : "Invite"}
        </button>
      </td>
    </tr>
  });

  var betaTable = <table className="betaMailList center">
    <tbody>
      {betaRows}
    </tbody>
  </table>;

  var content = (
    <div>
      <h1>Administration</h1>

      <h3>Current admins</h3>
      {userActionTable(ctrl, ctrl.admins)}

      <h3>Find users</h3>
      <form onsubmit={ctrl.findUser}>
        <input type="text" value={ctrl.query()} oninput={m.withAttr("value", ctrl.query)} />
      </form>
      <div className="results">
        {searchResults}
      </div>

      <h3>Beta mail list</h3>
      {betaTable}

      <h3>Database stats for the last day</h3>
      {dbStatsView(ctrl.dbStats(), ctrl.dbStatsLoading())}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

// helpers

var userActionTable = function(ctrl, users) {
  var rows = users.map(function(user) {
    var isAdmin = user.get("admin");
    var isCurator = user.get("curator");
    return <tr>
      <td>{user.get("name")}</td>
      <td>{user.get("email")}</td>
      <td>{isCurator ? "Yes" : "No"}</td>
      <td>{isAdmin ? "Yes" : "No"}</td>
      <td>
        <button type="button" className="btn" onclick={user.toggleCurator} disabled={user.get("id") === ctrl.user.get("id")}>{isCurator ? "Revoke curator" : "Make curator"}</button>
        <button type="button" className="btn" onclick={user.toggleAdmin} disabled={user.get("id") === ctrl.user.get("id")}>{isAdmin ? "Revoke admin" : "Make admin"}</button>
      </td>
    </tr>;
  });

  return <table className="userActionTable center">
    <thead><tr>
      <th>Name</th>
      <th>Email</th>
      <th>curator?</th>
      <th>admin?</th>
      <th>Actions</th>
    </tr></thead>
    <tbody>
      {rows}
    </tbody>
  </table>;
};

var dbStatsView = function(stats, loading) {
  var rows;
  if (loading) {
    rows = <tr><td colspan="4">{Spinner.view()}</td></tr>;
  } else {
    rows = _.map(stats, function(val, key) {
      return <tr>
        <td>{key}</td>
        <td>{val.total}</td>
        <td>{val.last_day.created}</td>
        <td>{val.last_day.updated}</td>
      </tr>;
    });
  }

  return <table className="dbStats center">
    <thead><tr><th>Key</th><th>Total</th><th>Created</th><th>Updated</th></tr></thead>
    <tbody>{rows}</tbody>
  </table>;
};

module.exports = AdminPage;
