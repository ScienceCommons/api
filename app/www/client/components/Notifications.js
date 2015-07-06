/** @jsx m */

"use strict";
require("./Notifications.scss");

var _ = require("underscore");
var cx = require("../utils/ClassSet.js");
var OnUnload = require("../utils/OnUnload.js");
var Dropdown = require("./Dropdown.js");

// number of digits
var Paths = {
  "1": "M24.643799,0.025247c-3.595337-0.281372-6.734497,1.817383-8.019653,4.886169c-0.325195,0.776611-1.138611,1.217407-1.978027,1.151733c0,0-0.000549,0-0.000793,0c-0.509766-0.038208-1.035156-0.059265-1.577881-0.060852c-0.020447-0.000061-0.038879-0.002319-0.059387-0.002319l0.000305,0.000305c-0.002869,0-0.005493-0.000305-0.008362-0.000305c-8.504578,0-13,4.495422-13,12.999999s4.495422,13,13,13s13-4.495422,13-13c0-0.002869-0.000305-0.005493-0.000305-0.008362L26,18.99192c0-0.020508-0.002258-0.03894-0.002319-0.059387c-0.001587-0.542725-0.022644-1.068115-0.060852-1.577881c0-0.000244,0-0.000549,0-0.000549c-0.065674-0.839661,0.375122-1.653075,1.151733-1.978271c3.068787-1.285156,5.167542-4.424316,4.886169-8.019653C31.673157,3.501687,28.498291,0.326821,24.643799,0.025247z",
  "2": "M39.982727,7.467468C39.707458,3.215454,35.986938,0,31.725952,0H24c-3.323608,0-6.169739,2.028503-7.376953,4.914001c-0.324524,0.775818-1.138855,1.214722-1.977234,1.149109c-0.000366,0-0.000793-0.000061-0.000793-0.000061c-0.520569-0.039001-1.055969-0.061035-1.610474-0.06189C13.024048,6.00116,13.014526,6,13.004028,6l0.000122,0.000122C13.002747,6.000122,13.001404,6,13,6C4.495422,6,0,10.495422,0,19s4.495422,13,13,13s13-4.495422,13-13v-0.000427l0,0c0-0.324158-0.006531-0.642517-0.019592-0.955078C25.933594,16.922791,26.855103,16,27.977844,16H32C36.594482,16,40.284424,12.126831,39.982727,7.467468z"
};

var Notifications = {};

Notifications.controller = function(options) {
  OnUnload(this);
  options = options || {};
  this.notifications = options.notifications || [];
  this.unreadCount = 2;

  var label = (
    <svg viewBox="0 0 40 32" className="notifications_icon">
      <path className="background" d={this.unreadCount >= 10 ? Paths[2] : Paths[1]} />
      <g transform="scale(0.65 0.65) translate(4,12)">
        <path className="icon" d="M30,22.666565l-3.818237-2.222168l-1.272705-10c0-2.454712-2.521606-4.444458-4.363647-4.444458H19v-4h-6v4h-1.54541c-1.842041,0-4.363647,1.989746-4.363647,4.444458l-1.272705,10L2,22.666565v3.333374h10v1c0,2.209106,1.790894,4,4,4s4-1.790894,4-4v-1h10V22.666565z"/>
      </g>
      <text x="20" y="13">{this.unreadCount}</text>
    </svg>
  );

  this.controllers.dropdown = new Dropdown.controller({
    className: "Notifications",
    label: label
  });
};

Notifications.view = function(ctrl) {
  var notifications = ctrl.notifications.map(function(notification) {
    var classes = cx({unread: !notification.get("read")});

    return (
      <li className={classes}>
        <h2>{notification.get("title")}</h2>
        <p>{notification.get("body")}</p>
      </li>
    );
  });

  var dropdownContent = <ul className="notifications">{notifications}</ul>;
  return new Dropdown.view(ctrl.controllers.dropdown, dropdownContent);
};

module.exports = Notifications;
