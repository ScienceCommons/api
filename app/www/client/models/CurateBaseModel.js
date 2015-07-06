/** @jsx m */

"use strict";

var _ = require("underscore");
var BaseModel = require("./BaseData.js").Model;

var CurateBaseModel = BaseModel.extend({
  sync: function(method, model, options) {
    options = options || {};
    options.config = function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
    };
    var res = BaseModel.prototype.sync.call(this, method, model, _.extend(options, {
      extract: function(xhr) {
        model.resetErrors();
        model.loading = false;
        model.loaded = false;
        model.not_found = xhr.status === 404;
        return xhr.responseText;
      },
      unwrapError: function(response) {
        model.addError(undefined, response.error);
        _.each(response.messages, function(messages, key) {
          _.each(messages, function(message) {
            model.addError(key, message);
          });
        });
        model.redraw();
      }
    }));
    return res;
  }
});

if (!_.isUndefined(localStorage)) {
  CurateBaseModel.prototype.fetch = function(options) {
    var _this = this;
    var res = BaseModel.prototype.fetch.call(this, options);
    if (!this.name) return res;

    if (!this.loaded && !this.isNew()) {
      try {
        var key = this.name+"/"+this.get("id");
        var item = localStorage.getItem(key);
        pingLocalStorage(key);
        if (!_.isEmpty(item)) {
          this.set(JSON.parse(item), {server: true});
        }
      } catch (e) {
        console.log("error", e);
      }
    }
    res.then(function(data) {
      try {
        var key = _this.name+"/"+_this.get("id");
        localStorage.setItem(key, JSON.stringify(_this._serverState));
        pingLocalStorage(key);
      } catch (e) {
        console.log("error", e);
      }
    });
    return res;
  };

  var pingLocalStorageData = localStorage.getItem("pingLocalStorageData");
  if (pingLocalStorageData) {
    pingLocalStorageData = JSON.parse(pingLocalStorageData);
  }
}

var maxRecords = 500;
pingLocalStorageData = pingLocalStorageData || {};
pingLocalStorageData.records = pingLocalStorageData.records || {};
pingLocalStorageData.ts = pingLocalStorageData.ts || 0;
function pingLocalStorage(key) {
  pingLocalStorageData.records[key] = pingLocalStorageData.records[key] || {numCalls: 0, ts: 0, key: key};
  pingLocalStorageData.records[key].numCalls++;
  pingLocalStorageData.records[key].ts = pingLocalStorageData.ts++;

  if (_.size(pingLocalStorageData.records) > maxRecords) {
    var remove = _.first(_.sortBy(pingLocalStorageData.records, 'ts'));
    localStorage.removeItem(remove.key);
    delete pingLocalStorageData.records[remove.key]
  }
  localStorage.setItem("pingLocalStorageData", JSON.stringify(pingLocalStorageData));
}

module.exports = CurateBaseModel;
