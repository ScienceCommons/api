module Commentable
  def add_comment(owner_id, comment, field=nil)
    comment = self.comments.new({
      comment: comment,
      owner_id: owner_id
    })
    comment.field = field if field
    comment.save
  end

  def update_comment_counts(comment)
    self.update_attribute(:comment_count, self.comments.count)
  end
end
