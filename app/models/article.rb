class Article < ActiveRecord::Base

  include ElasticMapper

  validates_uniqueness_of :doi
  validates_presence_of :doi, :title

  after_save :index

  mapping :title, :doi, :index => :not_analyzed
  mapping :title, :abstract
  mapping :publication_date, :type => :date
end
