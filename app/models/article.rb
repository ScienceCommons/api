class Article < ActiveRecord::Base

  include ElasticMapper
  include Commentable

  has_many :studies
  has_many :comments, as: :commentable
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id

  validates_uniqueness_of :doi
  validates_presence_of :doi, :title

  serialize :authors_denormalized

  mapping :title, :doi, :index => :not_analyzed
  mapping :title, :abstract, :authors
  mapping :publication_date, :type => :date

  after_save :index
  after_destroy :delete_from_index
  before_create do
    self.authors_denormalized = []
  end

  def add_author(first_name, middle_name, last_name)
    authors_denormalized.push(
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name
    )
    self
  end

  def authors
    authors_denormalized.map do |a|
      "#{a[:first_name]} #{a[:middle_name]} #{a[:last_name]}"
    end.join(' ')
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i
    end
  end
end
