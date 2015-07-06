/** @jsx m */
// taken from: http://codepen.io/georgehastings/pen/skznp

"use strict";
require("./Spinner.scss");

var Spinner = {};

Spinner.view = function() {
  return (
    <ul className="Spinner">
      <li></li>
      <li></li>
      <li></li>
    </ul>
  );
};

module.exports = Spinner;
