class Link < ActiveRecord::Base
  self.inheritance_column = :_type_disabled

  belongs_to :study
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :study_id
  validates_presence_of :name
  validates_presence_of :url
  validates_presence_of :type

  def as_json(opts={})
    super(opts).tap do |h|
      h[:comments] = self.comments.as_json() if opts[:comments]
      h
    end
  end
end
