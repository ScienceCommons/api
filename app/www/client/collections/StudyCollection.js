"use strict";

var CurateBaseCollection = require("./CurateBaseCollection.js");

var StudyCollection = CurateBaseCollection.extend({
  name: "StudyCollection",
  model: require("../models/StudyModel.js"),
  comparator: function(model) {
    return (model.get("number") || "").toString() + "ZZZZZZZ: " +  model.get("created_at");
  }
});

module.exports = StudyCollection;
