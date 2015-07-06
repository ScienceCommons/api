/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");

var ReplicationModel = CurateBaseModel.extend({
  name: "Replication",
  relations: ["Study", function() {
    return {
      replicating_study: {type: "one", model: require("./StudyModel.js")},
      study: {type: "one", model: require("./StudyModel.js")}
    };
  }],
  urlRoot: "replications"
});

module.exports = ReplicationModel;
