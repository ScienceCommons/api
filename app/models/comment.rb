class Comment < ActiveRecord::Base
  include Commentable

  validates_presence_of :commentable_id, :commentable_type, :comment, :owner_id
  has_many :comments, as: :commentable
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  belongs_to :commentable, polymorphic: true

  after_save do
    self.commentable.update_comment_counts(self)
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
