class Article < ActiveRecord::Base

  include ElasticMapper

  validates_uniqueness_of :doi
  validates_presence_of :doi, :title

  serialize :authors_denormalized

  mapping :title, :doi, :index => :not_analyzed
  mapping :title, :abstract, :authors
  mapping :publication_date, :type => :date

  after_save :index
  before_create do
    self.authors_denormalized = []
  end

  def add_author(first_name, middle_name, last_name)
    authors_denormalized.push(
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name
    )
  end

  def authors
    authors_denormalized.map do  |a|
      "#{a[:first_name]} #{a[:middle_name]} #{a[:last_name]}"
    end.join(' ')
  end
end
