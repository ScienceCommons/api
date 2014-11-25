class Author < ActiveRecord::Base
  include ElasticMapper

  belongs_to :user
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  has_many :article_authors, dependent: :destroy
  has_many :articles, :through => :article_authors
  has_many :model_updates, as: :changeable, dependent: :destroy
  belongs_to :primary_author, :class_name => "Author", :foreign_key => :same_as_id
  has_many :duplicate_authors, :class_name => "Author", :foreign_key => :same_as_id

  validates_uniqueness_of :orcid, unless: lambda { |author| author.orcid.blank? }
  validates_uniqueness_of :user_id, unless: lambda { |author| author.user_id.blank? }
  validates_presence_of :first_name, :last_name

  mapping :first_name, :middle_name, :last_name, :index => :not_analyzed

  after_save :index
  after_destroy :delete_from_index

  def full_name
    [first_name, middle_name, last_name].compact.join(" ")
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['articles'] = self.articles if opts[:articles]
      h['article_count'] = self.articles.count if opts[:article_count]
    end
  end
end
