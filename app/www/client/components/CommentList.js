/** @jsx m */
"use strict";

require("./CommentList.scss");

var m = require("mithril");
var _ = require("underscore");

var CommentForm = require("./CommentForm.js");

var Comment = {};

Comment.view = function(ctrl) {
  var comment = ctrl.comment;
  if (!comment.get("comments").isEmpty()) {
    var replies = new CommentList.view(ctrl.listController, {comments: comment.get("comments")});
  }
  if (ctrl.user && ctrl.onDelete && (comment.get("owner_id") === ctrl.listController.user.get("id") || ctrl.listController.user.get("admin"))) {
    var deleteButton = <button type="button" className="btn" onclick={ctrl.onDelete}>Delete</button>;
  }
  if (ctrl.user && ctrl.listController.reply) {
    var replyActive = ctrl.listController.replying() === comment;
    var replyButton = <button type="button" className={"btn " + (replyActive ? "active" : "")} onclick={ctrl.listController.toggleReply(comment)}><span className="icon icon_reply"></span> Reply</button>;
    if (replyActive) {
      var replyForm = new CommentForm.view(ctrl.listController.controllers.commentForm);
    }
  }
  if (comment.get("anonymous") && comment.get("owner_id") === ctrl.listController.user.get("id")) {
    var removeAnonymousButton = <button type="button" className="btn" onclick={removeAnonymous(comment)}>Make non-anonymous</button>;
  }

  var heading = _.compact([comment.get("authorName"), comment.get("timeAgo")]).join(": ");

  return (
    <div className="Comment">
      <div className="commentHeader">
        <h5>{heading}</h5>
      </div>
      <div className="commentContent">
        <p>{comment.get("comment")}</p>

        <div className="btn_group">
          {replyButton}
          {deleteButton}
          {removeAnonymousButton}
        </div>

        {replyForm}
        {replies}
      </div>
    </div>
  );
};

var CommentList = {};

CommentList.controller = function(options) {
  this.user = options.user;
  this.reply = options.reply;
  this.comments = options.comments;
  this.replying = m.prop(false);

  this.controllers = {};

  this.interval = setInterval(m.redraw, 60000); // redraw every minute for time-stamps
  var _this = this;
  this.onunload = function() {
    clearInterval(_this.interval);
  };

  this.toggleReply = function(comment) {
    return function(e) {
      if (_this.replying() === false) {
        _this.replying(comment);
        _this.controllers.commentForm = new CommentForm.controller({
          user: _this.user,
          comments: comment.get("comments"),
          onAdd: function() { _this.replying(false); }
        });
      } else {
        _this.replying(false);
        _this.controllers.commentForm = null;
      }
    };
  };
};

CommentList.view = function(ctrl, options) {
  options = options || {};
  var comments = (options.comments || ctrl.comments);
  var commentViews;
  if (ctrl.where) {
    commentViews = _.map(comments.where(ctrl.where), function(comment) {
      return new Comment.view({
        comment: comment,
        listController: ctrl,
        onDelete: onDelete((options.comments || ctrl.comments), comment)
      });
    });
  } else {
    commentViews = comments.map(function(comment) {
      return new Comment.view({
        comment: comment,
        listController: ctrl,
        onDelete: onDelete((options.comments || ctrl.comments), comment)
      });
    });
  }

  return <div className="CommentList">{commentViews}</div>;
};

module.exports = CommentList;

// helpers

function onDelete(collection, comment) {
  return function (e) {
    var confirmMessage = "This will delete your comment";
    if (comment.get("owner_id") !== App.user.get("id")) {
      confirmMessage = "This will delete the user's comment";
    }
    if (confirm(confirmMessage)) {
      collection.remove(comment, {sync: true});
    }
  };
}

function removeAnonymous(comment) {
  return function() {
    comment.removeAnonymous();
  }
}
