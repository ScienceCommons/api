/** @jsx m */

"use strict";
require("./AboutPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var AboutPage = {};

AboutPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AboutPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

AboutPage.view = function(ctrl) {
  var content = (
    <div>
      <h1>About</h1>
      <p>
        Independent verification is the cornerstone of science, however, in practice, the independent verification of published findings is difficult and not rewarded. Hence, gauging the reliability and validity of published scientific findings is typically very difficult (if not impossible). <b>Curate Science</b> is a web application that aims to help in these regards by facilitating and incentivizing the independent verification of published scientific findings in several respects.
      </p>
      <p>
        Independent verification is facilitated by enabling researchers to (1) link independent replications to original studies (and eventually linking conceptual replication studies meta-analytically), (2) curate available data/syntax to verify reproducibility of results within the browser, and (3) critically evaluate the interpretation/validity of findings via in-line comments (i.e., post-publication peer review on stereoids given evaluation done in the context of available data and replicability information).
      </p>
      <p>
        Curate Science will incentivize independent verififation by (1) prominently displaying recent user contributions on the homepage to reward researchers and (2) offering unique high-utility features that motivate users to regularly use and engage with site content (e.g., notifications of new replications, new activity on articles a user has contributed to, and discovery of new related articles). Furthermore, knowing that other researchers can benefit from one's independent verification activities acts as an incentive to actually engage in those activities. For example, a researcher is more likely to verify the reproducibility of a study's results if they know other researchers' may benefit from those activities (e.g., researchers wanting to re-analyze a study's data from a different theoretical perspective can greatly benefit from a researcher who curated a study's data files to verify reproducibility). See <a href="#section-3">Features</a>, for a flowchart of our core features.
      </p>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AboutPage;
