/** @jsx m */

"use strict";
require("./Badge.scss");

var cx = require("../utils/ClassSet.js");

var Badge = {};

Badge.icons = {
  data: require("./icons/DataIcon.js"),
  disclosure: require("./icons/DisclosureIcon.js"),
  materials: require("./icons/MaterialsIcon.js"),
  registration: require("./icons/RegistrationIcon.js"),
  reproducible: require("./icons/ReproducibleIcon.js")
};

Badge.view = function(ctrl) {
  var classes = cx({
    Badge: true,
    active: ctrl.active
  });

  return (
    <svg x="0px" y="0px" viewBox="-2 -2 36 36" className={classes}>
      <path d="M16,32C5.532813,32,0,26.467188,0,16S5.532813,0,16,0s16,5.532813,16,16S26.467188,32,16,32z"/>
      {new Badge.icons[ctrl.badge].view(ctrl)}
    </svg>
  );
};

module.exports = Badge;
