class Author < ActiveRecord::Base
  include ElasticMapper

  belongs_to :user
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  has_many :article_authors, dependent: :destroy
  has_many :articles, :through => :article_authors
  has_many :model_updates, as: :changeable, dependent: :destroy

  validates_uniqueness_of :orcid, unless: lambda { |author| author.orcid.blank? }
  validates_uniqueness_of :user_id, unless: lambda { |author| author.user_id.blank? }
  validates_presence_of :first_name, :last_name

  mapping :first_name, :middle_name, :last_name, :index => :not_analyzed

  after_save :index
  after_destroy :delete_from_index

  def full_name
    [first_name, middle_name, last_name].compact.join(" ")
  end
end
