class Comment < ActiveRecord::Base

  validates_presence_of :commentable_id, :commentable_type, :comment, :owner_id
  has_many :comments, as: :commentable, dependent: :destroy
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  belongs_to :commentable, polymorphic: true
  belongs_to :primary_commentable, polymorphic: true

  before_create do
    if self.commentable.is_a? Comment
      self.primary_commentable = self.commentable.primary_commentable
    else
      self.primary_commentable = self.commentable
    end
  end

  after_create do
    self.commentable.update_attributes!(comment_count: self.commentable.comments.count)
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['comments'] = self.comments.as_json(opts) if opts[:comments]
      if h['anonymous'] && opts[:current_user_id] != h['owner_id']
        h.delete('owner_id')
      else
        h['name'] = self.owner.name
      end
      h
    end
  end
end
