class Comment < ActiveRecord::Base

  validates_presence_of :commentable_id, :commentable_type, :comment, :owner_id
  has_many :comments, as: :commentable
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  belongs_to :commentable, polymorphic: true

  after_create do
    self.commentable.update_attributes!(comment_count: self.commentable.comments.count)
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['comments'] = self.comments.as_json(opts) if opts[:comments]
      if h['anonymous']
        h.delete('owner_id')
      else
        h['name'] = self.owner.name
      end
      h
    end
  end
end
