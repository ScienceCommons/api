module Commentable
  def add_comment(owner_id, comment)
    self.comments.create({
      comment: comment,
      owner_id: owner_id
    })
  end

  def update_comment_counts(comment)
    self.update_attribute(:comment_count, self.comments.count)
  end
end
