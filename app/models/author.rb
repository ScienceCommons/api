class Author < ActiveRecord::Base
  include ElasticMapper

  belongs_to :user
  has_many :article_authors
  has_many :articles, :through => :article_authors

  validates_uniqueness_of :orcid
  validates_uniqueness_of :user_id
  validates_presence_of :first_name, :last_name

  mapping :first_name, :middle_name, :last_name, :index => :not_analyzed

  after_save :index
  after_destroy :delete_from_index
end
