class Comment < ActiveRecord::Base
  include Commentable

  validates_presence_of :commentable_id, :commentable_type, :comment, :owner_id
  has_many :comments, as: :commentable
  belongs_to :commentable, polymorphic: true

  after_save do
    self.commentable.update_comment_counts(self)
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i
      h
    end
  end
end
