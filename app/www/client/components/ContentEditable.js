/** @jsx m */

"use strict";
require("./ContentEditable.scss");

var cx = require("../utils/ClassSet.js");


var ContentEditable = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      hovering: false
    };
  },
  getDefaultProps: function() {
    return {
      editable: false
    };
  },
  handleMouseEnter: function() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.setState({hovering: true});
  },
  handleMouseLeave: function() {
    var _this = this;
    if (!this.state.editing) {
      this.timeout = setTimeout(function() {
        _this.timeout = null;
        _this.setState({hovering: false});
      }, 500);
    }
  },
  handleEditClick: function() {
    var _this = this;
    this.setState({editing: true}, function() {
      _this.refs.editable.getDOMNode().focus();
    });
    ga("send", "event", "ContentEditable", "click", "edit");
  },
  handleSubmit: function(e) {
    this.finishEdits();
    this.props.data.set(this.refs.editable.getDOMNode().textContent);
    ga("send", "event", "ContentEditable", "click", "submit");
  },
  handleCancelClick: function() {
    this.finishEdits();
    ga("send", "event", "ContentEditable", "click", "cancel");
  },
  finishEdits: function() {
    if (!this.state.hovering) {
      this.handleMouseLeave();
    }
    this.setState({editing: false, hovering: true});
  },
  /*jshint ignore:start */
  renderEditControls: function() {
    var buttons;
    if (this.state.editing) {
      var submitButton = <button type="button" onClick={this.handleSubmit}><span className="icon icon_check_mark"></span></button>;
      var cancelButton = <button type="button" onClick={this.handleCancelClick}><span className="icon icon_close"></span></button>;
      buttons = [submitButton, cancelButton];
    } else {
      buttons = <button type="button" onClick={this.handleEditClick}><span className="icon icon_edit"></span></button>;
    }
    var classes = cx({
      "controls": true,
      "editing": this.state.editing
    });

    return (
      <div className={classes}>
        {buttons}
      </div>
    );
  },
  render: function () {
    if (this.props.editable) {
      if (this.state.hovering) {
        var controls = this.renderEditControls();
      }

      return (
        <div className="ContentEditable" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <div ref="editable" contentEditable={this.state.editing} key={this.state.editing ? "editing": "notEditing"}>{this.props.data.val()}</div>
          {controls}
        </div>
      );
    } else {
      return <div className="ContentEditable">{this.props.data.val()}</div>
    }
  }
  /*jshint ignore:end */
});

module.exports = ContentEditable;