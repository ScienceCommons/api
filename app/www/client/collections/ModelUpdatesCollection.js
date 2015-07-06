"use strict";

var _ = require("underscore");
var CurateBaseCollection = require("./CurateBaseCollection.js");


var ModelUpdateCollection = CurateBaseCollection.extend({
  name: "ModelUpdateCollection",
  model: require("../models/ModelUpdateModel.js"),
  comparator: function(model) {
    return model.get("created_at");
  }
});

module.exports = ModelUpdateCollection;
