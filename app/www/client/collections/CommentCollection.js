"use strict";

var CurateBaseCollection = require("./CurateBaseCollection.js");

var CommentCollection = CurateBaseCollection.extend({
  name: "CommentCollection",
  model: require("../models/CommentModel.js")/*,
  url: function() {
    var url = API_ROOT + this.commentableType + "/" + this.commentableID + "/comments";
    if (this.field) {
      url = url + "/" + this.field;
    }
    return url;
  }
  */
});

module.exports = CommentCollection;
