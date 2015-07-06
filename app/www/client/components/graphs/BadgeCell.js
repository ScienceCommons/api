/** @jsx m */

"use strict";

var m = require("mithril");
var Badge = require("../Badge.js");

var BadgeCell = {};

BadgeCell.controller = function(ctrl) {
  ctrl.open = m.prop(false);
  ctrl.editing = m.prop(false);

  this.toggle = function(name) {
    return function() {
      if (ctrl.open() === name) {
        ctrl.open(false);
      } else {
        ctrl.open(name);
        ctrl.editing(false);
      }
    }
  };
};

BadgeCell.view = function(ctrl) {
  if (ctrl.open() !== false) {
    var dropdown = new BadgeCell.fields[ctrl.open()].DropdownView(ctrl);
  }

  return (
    <div>
      <ul className="badges cell section">
        <li onclick={ctrl.toggle("data")}>
          {new Badge.view({badge: "data", active: ctrl.study.hasBadge("data")})}
        </li>
        <li onclick={ctrl.toggle("materials")}>
          {new Badge.view({badge: "materials", active: ctrl.study.hasBadge("materials")})}
        </li>
        <li onclick={ctrl.toggle("registration")}>
          {new Badge.view({badge: "registration", active: ctrl.study.hasBadge("registration")})}
        </li>
        <li onclick={ctrl.toggle("disclosure")}>
          {new Badge.view({badge: "disclosure", active: ctrl.study.hasBadge("disclosure")})}
        </li>
      </ul>
      {dropdown}
    </div>
  );
};

BadgeCell.fields = {};
BadgeCell.fields.data = {};
BadgeCell.fields.data.DropdownController = function(ctrl) {
  ctrl.addFile = function() {
    ctrl.study.get("files").add({type: "data"});
  };

  ctrl.showDetails = function(file) {
    return function() {

    };
  };
};

BadgeCell.fields.data.DropdownView = function(ctrl) {
  var files = _.map(ctrl.study.get("files").where({type: "data"}), function(file) {
    return (
      <li onclick={ctrl.showDetails(file)}>
        {file.name}
        <a href={file.url}><span className="icon icon-download"></span></a>
        <span className="icon icon-comment"></span>
      </li>
    )
  });

  return (
    <div>
      <h1>Data &amp; Syntax</h1>
      <ul>
        {files}
      </ul>
      <footer>
        <button type="button" onclick={ctrl.addFile}>Add a file</button>
      </footer>
    </div>
  );
};

BadgeCell.fields.data.EditorController = function(ctrl) {
  ctrl.editingFileName = m.prop("");
  ctrl.editingFileUrl = m.prop("");

  ctrl.saveEdit = function() {
    // save to model
    // reset
    ctrl.editingFileName = m.prop("");
    ctrl.editingFileUrl = m.prop("");
  };
};

BadgeCell.fields.data.EditorView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.editingFileName()} oninput={m.withAttr("value", ctrl.editingFileName)} placeholder="File name"/>
      <input type="text" value={ctrl.editingFileUrl()} oninput={m.withAttr("value", ctrl.editingFileUrl)} placeholder="URL" />
    </div>
  );
};

BadgeCell.fields.materials = {};
BadgeCell.fields.materials.DropdownView = function(ctrl) {
  var files = _.map(ctrl.study.get("files").where({type: "materials"}), function(file) {
    return (
      <li>
        {file.name}
        <a href={file.url}><span className="icon icon-download"></span></a>
        <span className="icon icon-comment"></span>
      </li>
    )
  });

  return (
    <div>
      <h1>Materials</h1>
      <ul>
        {files}
      </ul>
      <footer>
        <button type="button">Add a file</button>
      </footer>
    </div>
  )
};

BadgeCell.fields.registrations = {};
BadgeCell.fields.registrations.DropdownView = function(ctrl) {
  var files = _.map(ctrl.study.get("files").where({type: "registration"}), function(file) {
    return (
      <li>
        {file.name}
        <span className="icon icon-proceed"></span>
        <span className="icon icon-comment"></span>
      </li>
    )
  });

  return (
    <div>
      <h1>Pre-registration</h1>
      <ul>
        {files}
      </ul>
      <footer>
        <button type="button">Add a file</button>
      </footer>
    </div>
  )
};

BadgeCell.fields.disclosures = {};
BadgeCell.fields.disclosures.DropdownView = function(ctrl) {
  return (
    <div>
      <h1>Disclosures</h1>
      <ul>
        <li>Exclusions</li>
        <li>Measures</li>
        <li>Conditions</li>
        <li>Sample size</li>
      </ul>
    </div>
  )
};

BadgeCell.fileDropdown = {};
BadgeCell.fileDropdown.controller = function() {};
BadgeCell.fileDropdown.view = function() {};

BadgeCell.fileEditor = {};
BadgeCell.fileEditor.controller = function() {
  this.fileName = m.prop("");
  this.fileUrl = m.prop("");

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
  };

  this.removeFile = function() {};
};

BadgeCell.fileEditor.view = function(ctrl) {
  return (
    <form onsubmit={ctrl.handleSubmit}>
      <header>
        <button type="submit">Done</button>
        <button type="button" onclick={ctrl.removeFile}><span className="icon icon-delete"></span></button>
      </header>

      <input type="text" value={ctrl.fileName()} oninput={m.withAttr("value", ctrl.fileName)} placeholder="File name"/>
      <input type="text" value={ctrl.fileUrl()} oninput={m.withAttr("value", ctrl.fileUrl)} placeholder="URL" />
    </form>
  );
};


module.exports = BadgeCell;
