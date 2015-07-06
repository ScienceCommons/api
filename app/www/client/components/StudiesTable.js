/** @jsx m */

"use strict";
require("./StudiesTable.scss");

var _ = require("underscore");
var Study = require("../models/StudyModel.js");
var OnUnload = require("../utils/OnUnload.js");
var cx = require("../utils/ClassSet.js");
var Spinner = require("./Spinner.js");
var Modal = require("../components/Modal.js");
var Badge = require("../components/Badge.js");
var StudyFinder = require("../components/StudyFinder.js");
var CommentForm = require("../components/CommentForm.js");
var CommentList = require("../components/CommentList.js");
var ScrollIntoView = require("../utils/ScrollIntoView.js");

var StudiesTable = {};
StudiesTable.instances = {};

StudiesTable.controller = function(opts) {
  OnUnload(this, StudiesTable.instances);
  StudiesTable.instances[this.id] = this;

  this.article = opts.article;
  this.user = opts.user;
  this.active = m.prop({study_id: false, field: false, editing: false, dropdown: false});
  this.expanded = m.prop({}); // study_id's
  this.newStudy = m.prop(false);
  this.edits = m.prop({});
  this.studyFinderStudy = m.prop(false);

  var _this = this;

  var oldUnload = this.onunload;
  this.onunload = function(e) {
    if (_this.article.hasChanges()) {
      if (!confirm("You have unsaved changes on this article.  Do you wish to navigate away without saving?")) {
        return e.preventDefault();
      }
    } else if (_this.article.get("studies").any(function(study) { return study.hasChanges(); })) {
      if (!confirm("You have unsaved changes on studies.  Do you wish to navigate away without saving?")) {
        return e.preventDefault();
      }
    }
    oldUnload.call(_this);
  };

  this.addStudy = function() {
    if (_this.newStudy() !== false) {
      // warn that existing new study must be saved or removed
    } else {
      _this.newStudy(new Study({article_id: _this.article.get("id")}));
    }
  };

  this.saveNewStudy = function() {
    if (_this.newStudy() === false) {
      // error we shouldn't hit this
    } else {
      _this.article.get("studies").add(_this.newStudy(), {sync: true, include: ["links"]});
      _this.newStudy(false);
      var edits = _this.edits();
      edits[undefined] = {};
      _this.edits(edits);
    }
  };

  this.discardNewStudy = function() {
    // deallocate?
    _this.newStudy(false);
  };

  this.saveStudy = function(study) {
    return function(e) {
      study.save({include: ["links"]}).then(function() {
        _this.article.get("studies").sort();
      });
      _this.article.get("studies").sort();
    };
  };

  this.resetStudy = function(study) {
    return function(e) {
      study.reset({include: ["links"]});
    };
  };

  this.deleteStudy = function(study) {
    return function(e) {
      var confirmation = confirm("This will permanently delete the study");
      if (confirmation) {
        _this.article.get("studies").remove(study, {sync: true});
      }
    };
  };

  this.unlinkReplication = function(study, replication) {
    return function(e) {
      var confirmation = confirm("This will permanently unlink the replication");
      if (confirmation) {
        study.get("replications").remove(replication, {sync: true});
      }
    };
  };

  this.toggleModal = function(study, field) {
    return function() {
      var active = _this.active();
      var id = study.get("id");
      if (active.study_id === id && active.field === field && !active.editing) {
        active = {study_id: false, field: false, editing: false, dropdown: false};
      } else {
        if (active.study_id !== id || active.field !== field) {
          active.editing = false;
        }
        active.study_id = id;
        active.field = field;
      }
      if (study.isNew()) {
        active.editing = true;
      }
      _this.active(active);
    };
  };

  this.toggleExpanded = function(study) {
    return function(e) {
      e.preventDefault();
      var expanded = _this.expanded();
      var id = study.get("id");
      expanded[id] = !expanded[id];
      _this.expanded(expanded);
    };
  };

  this.handleEditClick = function() {
    var active = _this.active();
    active.editing = true;
    _this.active(active);
  };

  this.handleEditSubmit = function(study, field) {
    return function(e) {
      e.preventDefault();
      var active = _this.active();
      active.editing = false;
      _this.active(active);
      if (StudiesTable.modalEditors[field] && StudiesTable.modalEditors[field].onsubmit) {
        StudiesTable.modalEditors[field].onsubmit(_this, study);
      } else {
        var value = _this.getEdits(study, field, "value");
        if (!_.isUndefined(value)) {
          study.set(field, value);
        }
      }
      // if not isNew...
      // study.save...
    };
  };

  this.handleFileEditSubmit = function(study, file) {
    return function(e) {
      e.preventDefault();
      var active = _this.active();
      active.editing = false;
      _this.active(active);
      var fileEdits = _this.getEdits(study, "links_"+file.get("id"))
      file.set(fileEdits);
    };
  };


  this.getEdits = function(study, field, attr) {
    var edits = _this.edits();
    var id = study.get("id");
    edits[id] = edits[id] || {};
    edits[id][field] = edits[id][field] || {};
    if (_.isUndefined(attr)) {
      return edits[id][field];
    } else {
      return edits[id][field][attr];
    }
  };

  this.updateEdits = function(study, field, attr) { // a field might have multiple editable fields
    return function(value) {
      var edits = _this.edits();
      var id = study.get("id");
      edits[id] = edits[id] || {};
      edits[id][field] = edits[id][field] || {};
      edits[id][field][attr] = value;
      _this.edits(edits);
    };
  };

  this.openStudyFinder = function(study) {
    return function() {
      _this.studyFinderStudy(study);
      _this.controllers.studyFinderModal.open(true);
    };
  };

  this.toggleReplication = function(replicationStudy) {
    var study = _this.studyFinderStudy();
    if (study) {
      if (study.get("article_id") === replicationStudy.get("article_id")) {
        alert("You are picking another study in this article to be a replication.  That is not allowed.");
      } else {
        if (study.get("replications").find(function(replication) { return replication.get("replicating_study_id") === replicationStudy.get("id"); })) {
          study.removeReplication(replicationStudy);
        } else {
          study.addReplication(replicationStudy);
          //_this.controllers.studyFinderModal.open(false);
          var expanded = _this.expanded();
          var id = study.get("id");
          expanded[id] = true;
          _this.expanded(expanded);
        }
      }
    }
  };

  this.controllers.studyFinderModal = new Modal.controller();
  this.controllers.studyCommentAndEditModal = new Modal.controller();
  this.controllers.studyFieldCommentForm = new CommentForm.controller({
    user: this.user
  });

  this.controllers.studyFinder = new StudyFinder.controller({
    selectStudy: this.toggleReplication,
    parentStudy: this.studyFinderStudy
  });

  this.studiesConfig = function(el, isInitialized) {
    _this.studiesEl = el;
  };
};

StudiesTable.view = function(ctrl) {
  var content;
  if (ctrl.article.get("studies").loading) {
    content = Spinner.view();
  } else {
    var studies = ctrl.article.get("studies").map(function(study) {
      if (!ctrl.expanded()[study.get("id")]) {
        var replications = study.get("replications").map(function(replication) {
          return StudiesTable.studyView(ctrl, replication.get("replicating_study"), {replication: true, replicationModel: replication, parentStudy: study});
        });
        if (replications.length === 0) {
          ctrl.expanded({});
        }
      }

      return [StudiesTable.studyView(ctrl, study), replications];
    });

    if (ctrl.newStudy()) {
      studies.push(StudiesTable.studyView(ctrl, ctrl.newStudy(), {new: true}));
    } else {
      var addStudyButton;
      if (ctrl.user){
        addStudyButton = <button className="btn addStudy" onclick={ctrl.addStudy}>Add study</button>;
      }
    }
    content = [<ul className="studies" config={ctrl.studiesConfig}>{_.flatten(studies)}</ul>, addStudyButton];
  }

  if (ctrl.studyFinderStudy()) {
    var study = ctrl.studyFinderStudy();
    var studyFinderModal = Modal.view(ctrl.controllers.studyFinderModal, {
      label: "Add a replication to " + study.etAl(1) + " (" + study.get("year") +") "+  study.get("number"),
      content: new StudyFinder.view(ctrl.controllers.studyFinder)
    });
  }

  // add study column
  if (ctrl.article.get("studies").length > 0 || ctrl.newStudy()) {
    var header = <header>
      <div className="cell replication_path">Replication path</div>
      <div className="cell number">Authors &amp; Study Number</div>
      <div className="cell badges">
        Study Components&nbsp;
        <span class="glyphicon glyphicon-info-sign tooltip" title="Link data/syntax, materials, or pre-registration info to a study by clicking on the corresponding icon and clicking &quot;Add a link&quot;."></span>
      </div>
      <div className="cell independent_variables">Independent Variables</div>
      <div className="cell dependent_variables">Dependent Variables</div>
      <div className="cell n">N <span className="icon icon_person"></span></div>
      <div className="cell power">
        Power&nbsp;
        <span class="glyphicon glyphicon-info-sign tooltip" title="Enter the a priori power level to detect an effect size as large (or larger) than in an original study (for replication studies only)."></span>
      </div>
      <div className="cell effect_size">Effect Size</div>
    </header>;
  }

  return (
    <div className="StudiesTable">
      {studyFinderModal}
      {header}
      {content}
    </div>
  );
};

StudiesTable.studyView = function(ctrl, study, options) {
  var options = options || {};
  var cells = _.map(["number", "badges", "independent_variables", "dependent_variables", "n", "power", "effect_size"], function(field) {
    return StudiesTable.studyCellView(ctrl, study, field, options);
  });

  var saveButtons = [];
  if (options.new || study.hasChanges({include: ["links"]})) {
    if (study.saving) {
      saveButtons.push(<button type="button" key="save" className="btn saveStudy" disabled={true} onclick={options.new ? ctrl.saveNewStudy : ctrl.saveStudy(study)}>Saving...</button>);
    } else {
      saveButtons = [
        <button type="button" className="btn saveStudy" key="save" disabled={study.saving} onclick={options.new ? ctrl.saveNewStudy : ctrl.saveStudy(study)}>Save</button>,
        <button type="button" className="btn discardStudy" key="discard" onclick={options.new ? ctrl.discardNewStudy : ctrl.resetStudy(study)}>Discard</button>
      ];
    }
  }
  else if (!options.new && ctrl.user) {
    if (options.replication) {
      saveButtons.push(<button type="button" key="unlink" className="btn unlinkReplication" onclick={ctrl.unlinkReplication(options.parentStudy, options.replicationModel)}>Unlink</button>);
    } else {
      saveButtons = <button type="button" key="delete" className="btn deleteStudy" onclick={ctrl.deleteStudy(study)}>Delete</button>;
    }
  }

  var classes = cx({
    "study": true,
    "new": options.new,
    "replication": options.replication,
    "expanded": !ctrl.expanded()[study.get("id")],
    "active": ctrl.active().study_id === study.get("id")
  });

  return (
    <li className={classes}>
      {StudiesTable.studyCellView(ctrl, study, "replication_path", options)}
      <div className="cellGroup">
        {cells}
      </div>
      <div className="btn_group saveButtons">{saveButtons}</div>
    </li>
  );
};


StudiesTable.studyCellView = function(ctrl, study, field, options) {
  var active = ctrl.active();
  if (field !== "badges" && active.study_id === study.get("id") && active.field === field) {
    var modal = StudiesTable.studyModalView(ctrl, study, field, options);
  }

  var contents = [];
  if (study.hasErrors(field)) {
    var errorsList = _.map(study.errors(field), function(message) {
      return <li>{message}</li>;
    });
    contents.push(<ul className="errors">{errorsList}</ul>);
  }
  if (StudiesTable.cellViews[field]) {
    contents.push(StudiesTable.cellViews[field](ctrl, study, options));
  } else {
    contents.push(study.get(field));
  }

  var numComments = study.get("comments").where({field: field}).length;
  if (numComments > 0) {
    var commentMarker = <span className="icon icon_comment" title={numComments + (numComments === 1 ? " comment" : " comments")}></span>;
  }

  // also include indicators
  var cellContents = <div className="cellContents">
    {contents}
    {commentMarker}
  </div>

  if (field !== "badges" && field !== "replication_path") {
    cellContents.attrs.onclick = ctrl.toggleModal(study, field, options);
  }


  return (
    <div className={"cell " + field + (modal ? " active" : "")}>
      {cellContents}
      {modal}
    </div>
  );
};

StudiesTable.studyModalView = function(ctrl, study, field, options) {
  ctrl.controllers.studyCommentAndEditModal.open(true);
  ctrl.controllers.studyFieldCommentForm.comments = study.get("comments");

  if (ctrl.active().editing) {
    var inputs;
    if (StudiesTable.modalEditors[field]) {
      inputs = StudiesTable.modalEditors[field].view(ctrl, study);
    } else {
      inputs = (
        <div className="inputs">
          <input type="text" config={focusConfig} value={_.isUndefined(ctrl.getEdits(study, field, "value")) ? study.get(field) : ctrl.getEdits(study, field, "value")} oninput={m.withAttr("value", ctrl.updateEdits(study, field, "value"))} />
        </div>
      );
    }

    return Modal.view(ctrl.controllers.studyCommentAndEditModal, {
      label: <button type="submit" className="btn">Done</button>,
      buttons: false,
      content: inputs,
      wrapper: <form onsubmit={ctrl.handleEditSubmit(study, field)} />
    });
  } else {
    var commentsAndChanges = [];
    if (study.commentable(field)) {
      ctrl.controllers.studyFieldCommentForm.field = field;
      commentsAndChanges = study.get("comments").map(function(comment) {
        if (comment.get("field") === field) {
          var heading = _.compact([comment.get("authorName"), comment.get("timeAgo")]).join(": ");
          var commentView = (
            <li className="Comment">
              <div><span className="pill">Comment</span></div>
              <header>{heading}</header>
              <p>{m.trust(comment.get("html_comment"))}</p>
            </li>
          );
          return {date: comment.get("created_at"), view: commentView};
        }
      });
      var modalFooter;
      if (ctrl.user){
        modalFooter = CommentForm.view(ctrl.controllers.studyFieldCommentForm);
      } else {
        modalFooter = <div>Please <a href="/beta/#/login">log in</a> to edit or comment</div>;
      }
    }

    commentsAndChanges = commentsAndChanges.concat(study.get("model_updates").map(function(model_update) {
      if (model_update.hasFieldChanges(field)) {
        var heading = _.compact([model_update.get("user"), model_update.get("timeAgo")]).join(": ");
        var state = model_update.get("model_changes")[field];
        var diffView = StudiesTable.modelUpdateViews[field] || StudiesTable.modelUpdateViews.default;
        var updateView = (
          <li className="modelUpdate">
            <div><span className="pill">Update</span></div>
            <header>{heading}</header>
            <p>{diffView(state)}</p>
          </li>
        );
        return {date: model_update.get("created_at"), view: updateView};
      }
    }));

    var modalContent = <ul className="commentsAndHistory">{_.chain(commentsAndChanges).compact().sortBy('date').pluck('view').value().reverse()}</ul>;

    var editButton;
    if (App.user && App.user.canEdit()) {
      editButton = <button type="button" className="btn edit" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>;
    }

    return Modal.view(ctrl.controllers.studyCommentAndEditModal, {
      label: ModalLabels[field] || field,
      buttons: editButton || false,
      content: modalContent,
      footer: modalFooter
    });
  }
};

function focusConfig(el, isInitialized) {
  if (!isInitialized) {
    el.focus();
  }
}

var ModalLabels = {
  number: "Authors and Study Number",
  study_components: "Study Components",
  independent_variables: "Independent Variables",
  dependent_variables: "Dependent Variables",
  n: "Sample Size",
  power: "Power",
  effect_size: "Effect Size"
};

StudiesTable.cellViews = {};

StudiesTable.cellViews.replication_path = function(ctrl, study, options) {
  if (!options.replication && ctrl.user) {
    var addReplicationLink = <span class="add_replication" onclick={ctrl.openStudyFinder(study)} title="Add replication"></span>;
  }

  var count = study.get("replications").length;
  if (count > 0) {
    var replicationCountLink = <span className="icon icon_replication count" onclick={ctrl.toggleExpanded(study)} title="Show/Hide replications">{count}</span>;
  }

  return [addReplicationLink, replicationCountLink];
};

var BadgeHeaders = {
  "data": "Data & Syntax",
  "materials": "Materials",
  "registration": "Registration",
  "disclosure": "Disclosure"
};

StudiesTable.cellViews.badges = function(ctrl, study, options) {
  var active = ctrl.active();
  if (active.study_id === study.get("id") && active.field === "badges") {
    var activeBadge = active.badge;
    var dropdown = BadgeDropdowns[activeBadge](ctrl, study, options);
  }

  var badges = _.map(["data", "materials", "registration", "disclosure"], function(badge) {

    return <li onclick={StudiesTable.cellViews.handleBadgeClick(ctrl, study, badge)} className={activeBadge === badge ?  "active" : ""} title={BadgeHeaders[badge]}>
      {Badge.view({badge: badge, active: study.hasBadge(badge)})}
    </li>;
  });

  return [
    <ul className={"badges " + (activeBadge ? "active" : "")}>{badges}</ul>,
    dropdown
  ];
};

StudiesTable.cellViews.handleBadgeClick = function(ctrl, study, badge) {
  return function(e) {
    var active = ctrl.active();
    if (active.study_id === study.get("id") && active.field === "badges" && active.badge === badge) {
      ctrl.active({});
    } else {
      ctrl.active({
        study_id: study.get("id"),
        field: "badges",
        badge: badge
      });
    }
  };
};

var BadgeDropdowns = {};
BadgeDropdowns.data = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "data", options);
};

BadgeDropdowns.materials = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "materials", options);
};

BadgeDropdowns.registration = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "registration", options);
};

BadgeDropdowns.disclosure = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "disclosure", options);
};

function removeFileFromStudy(study, file) {
  return function(e) {
    study.get("links").remove(file);
  };
};

function addFile(ctrl, study, type) {
  return function(e) {
    var newFile = study.get("links").add({type: type});
    var active = ctrl.active();
    active.editing = true;
    active.file = newFile;
    ctrl.active(active);
  };
};

function fileDropdown(ctrl, study, type, options) {
  var links = study.linksByType(type);
  var active = ctrl.active();
  var body = <table className="files"><tbody><tr className="noFiles"><td>No links</td></tr></tbody></table>;
  var modal;

  if (links.length > 0) {
    var rows = _.map(links, function(file) {
      var fileIsActive = active.file === file;
      if (fileIsActive) {
        ctrl.controllers.studyCommentAndEditModal.open(true);
        if (active.editing) {
          var edits = ctrl.getEdits(study, "links_"+file.get("id"));

          modal = Modal.view(ctrl.controllers.studyCommentAndEditModal, {
            label: <button type="submit" className="btn">Done</button>,
            buttons: <button type="button" className="btn" onclick={removeFileFromStudy(study, file)}><span className="icon icon_delete"></span></button>,
            content: <div>
              <input type="text" config={focusConfig} placeholder="Label goes here" value={_.isUndefined(edits.name) ? file.get("name") : edits.name} oninput={m.withAttr("value", ctrl.updateEdits(study, "links_"+file.get("id"), "name"))}/>
              <input type="text" placeholder="URL goes here" value={_.isUndefined(edits.url) ? file.get("url") : edits.url} oninput={m.withAttr("value", ctrl.updateEdits(study, "links_"+file.get("id"), "url"))}/>
            </div>,
            wrapper: <form onsubmit={ctrl.handleFileEditSubmit(study, file)} />
          });
        } else {
          ctrl.controllers.studyFieldCommentForm.comments = file.get("comments");
          var comments = file.get("comments").map(function(comment) {
            return (
              <li>{comment.get("comment")}</li>
            );
          });

          if (App.user && App.user.canEdit()) {
            var modalEditButton = <button type="button" className="btn edit" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>;
          }

          modal = Modal.view(ctrl.controllers.studyCommentAndEditModal, {
            label: file.get("name"),
            buttons: modalEditButton || false,
            content: new CommentList.view({comments: file.get("comments"), user: ctrl.user}),
            footer: CommentForm.view(ctrl.controllers.studyFieldCommentForm)
          });
        }
      }

      var numComments = file.get("comments").length;
      if (numComments > 0) {
        var commentMarker = <span className="icon icon_comment" title={numComments + (numComments === 1 ? " comment" : " comments")}></span>;
      }
      return <tr onclick={handleBadgeDropdownFileClick(ctrl, study, file)} className={fileIsActive ? "active" : ""}>
        <td className="fileName">{file.get("name")}</td>
        <td className="buttons">
          {commentMarker}
          <button type="button" className="btn" title="Download" onclick={downloadFile(file)}><span className="icon icon_download"></span></button>
        </td>
      </tr>;
    });

    body = <table className="files"><tbody>
      {rows}
    </tbody></table>;
  };

  var filesFooter;
  if (App.user && App.user.canEdit() && !options.replication) {
    filesFooter = <footer>
      <button type="button" className="btn" onclick={addFile(ctrl, study, type)}>Add a link</button>
    </footer>;
  } else {
    filesFooter = <footer>Please <a href="/beta/#/login">log in</a> to add a link</footer>;
  }

  return <div className="dropdown" config={fileDropdownConfig}>
    <header>{BadgeHeaders[type]}</header>
    <div className="body">
      {body}
    </div>
    {filesFooter}
    {modal}
  </div>;
};

function fileDropdownConfig(el, isInitialized, context) {
  if (!isInitialized) {
    ScrollIntoView(el);
  }
};

function handleBadgeDropdownFileClick(ctrl, study, file) {
  return function(e) {
    e.preventDefault();
    var active = ctrl.active();
    active.file = file;
    active.editing = false;
    ctrl.active(active);
  };
};

StudiesTable.cellViews.number = function(ctrl, study) {
  if (study.get("replication_of").length > 0) {
    var originalStudy = study.get("replication_of").first().get("study");
    var originalYear = originalStudy.get("year");
    if (originalYear) {
      originalYear = "(" + originalYear + ")";
    }
    var replicates = <li>
      Replicating: <a href={"/articles/"+originalStudy.get("article_id")} config={m.route}>{originalStudy.etAl(1)} {originalYear}</a>
    </li>;
  }


  var year = study.get("year");
  if (year) {
    year = "(" + year + ")";
  }

  var etAl = <li>{study.etAl(1)} {year}</li>;

  if(study.get('id') == undefined || study.loaded == true) {
    etAl = <li>{ctrl.article.authors().etAl(2)} ({ctrl.article.get("year")})</li>;
  }

  return <ul>
    {etAl}
    <li>{study.get("number")}</li>
    {replicates}
  </ul>;
};

StudiesTable.cellViews.effect_size = function(ctrl, study) {
  return study.get("displayEffectSize");
};

StudiesTable.modalEditors = {};
StudiesTable.modalEditors.effect_size = {};

StudiesTable.modalEditors.effect_size.view = function(ctrl, study) {
  var measure = _.isUndefined(ctrl.getEdits(study, "effect_size", "measure")) ? study.get("effectSizeMeasure") : ctrl.getEdits(study, "effect_size", "measure");
  var val = _.isUndefined(ctrl.getEdits(study, "effect_size", "value")) ? study.get("effectSizeValue") : ctrl.getEdits(study, "effect_size", "value");

  return (
    <div className="inputs">
      <select value={measure} onchange={m.withAttr("value", ctrl.updateEdits(study, "effect_size", "measure"))}>
        <option value="d">d</option>
        <option value="eta">η</option>
        <option value="r">r</option>
        <option value="phi">φ</option>
        <option value="eta_sqr">η²</option>
        <option value="partial_eta_sqr">partial η²</option>
      </select>
      <input type="text" config={focusConfig} value={val} oninput={m.withAttr("value", ctrl.updateEdits(study, "effect_size", "value"))} />
    </div>
  );
};

StudiesTable.modalEditors.effect_size.onsubmit = function(ctrl, study) {
  if (ctrl.getEdits(study, "effect_size", "measure")) {
    study.set("effectSizeMeasure", ctrl.getEdits(study, "effect_size", "measure"));
  } else if (_.isEmpty(study.get("effectSizeMeasure"))) {
    study.set("effectSizeMeasure", "d"); // d is the default
  }
  if (ctrl.getEdits(study, "effect_size", "value")) {
    study.set("effectSizeValue", ctrl.getEdits(study, "effect_size", "value"));
  }
};

StudiesTable.cellViews.independent_variables = _.partial(arrayFieldCellView, "independent_variables");
StudiesTable.modalEditors.independent_variables = {};
StudiesTable.modalEditors.independent_variables.view = _.partial(arrayFieldEditView, "independent_variables");
StudiesTable.modalEditors.independent_variables.onsubmit = _.partial(arrayFieldSubmit, "independent_variables");

StudiesTable.cellViews.dependent_variables = _.partial(arrayFieldCellView, "dependent_variables");
StudiesTable.modalEditors.dependent_variables = {};
StudiesTable.modalEditors.dependent_variables.view = _.partial(arrayFieldEditView, "dependent_variables");
StudiesTable.modalEditors.dependent_variables.onsubmit = _.partial(arrayFieldSubmit, "dependent_variables");

StudiesTable.modelUpdateViews = {};
StudiesTable.modelUpdateViews.default = function(state) {
  return state[0] + " => " + state[1];
};
StudiesTable.modelUpdateViews.effect_size = function(state) {
  var oldVal = _.first(_.pairs(state[0]));
  var prevValue = "";
  if(oldVal != undefined) {
    oldVal[0] = effectSizeSymbol[oldVal[0]];
    prevValue = oldVal.join(": ")
  } else {
    prevValue = "null"
  }
  var newVal = _.first(_.pairs(state[1]));
  newVal[0] = effectSizeSymbol[newVal[0]];
  return prevValue + " => " + newVal.join(": ");
};


function arrayFieldCellView(field, ctrl, study) {
  if (field !== "number" || ctrl.article.get("id") !== study.get("article_id")) {
    var items = _.map(study.get(field), function(variable) {
      return <li>{variable}</li>;
    });

    return <ul>{items}</ul>;
  }
};

function arrayFieldEditView(field, ctrl, study) {
  var variables = arrayFieldCurrentState(field, ctrl, study);
  if (_.last(variables) !== "") {
    variables.push("");
  }

  var len = _.size(variables);
  var inputs = _.map(variables, function(variable, i) {
    return <li><input type="text" config={i === 0 ? focusConfig : undefined} placeholder="Add another independent variable" value={variable} oninput={m.withAttr("value", ctrl.updateEdits(study, field, i))} /></li>;
  });

  return (
    <ul className="inputs">
      {inputs}
    </ul>
  );
};

function arrayFieldSubmit(field, ctrl, study) {
  study.set(field, _.compact(arrayFieldCurrentState(field, ctrl, study)));
};

function arrayFieldCurrentState(field, ctrl, study) {
  var variables = _.map(study.get(field), function(variable, i) {
    var cached = ctrl.getEdits(study, field, i)
    return _.isUndefined(cached) ? variable : cached;
  });
  variables = variables.concat(_.filter(ctrl.getEdits(study, field), function(variable, i) {
    return i >= variables.length;
  }));
  return variables;
};

document.addEventListener("mousedown", closeActiveOnMousedown);
document.addEventListener("touchstart", closeActiveOnMousedown);

module.exports = StudiesTable;

//helpers

function closeActiveOnMousedown(e) {
  _.each(StudiesTable.instances, function(instance) {
    if (instance.studiesEl && !instance.studiesEl.contains(e.target)) {
      instance.active({});
    }
  });
  m.redraw();
}

function downloadFile(file) {
  return function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (file.get("url").match(/^https?:\/\//)) {
      window.open(file.get("url"));
    } else {
      window.open("https://" + file.get("url"));
    }
  };
}

var effectSizeSymbol = {
  d: "d",
  eta: "η",
  r: "r",
  phi: "φ",
  eta_sqr: "η²",
  partial_eta_sqr: "partial η²"
};
