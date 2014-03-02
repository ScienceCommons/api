class Article < ActiveRecord::Base

  extend ElasticSearchHelpers

  validates_uniqueness_of :doi
  validates_presence_of :doi, :title

  def index
    $index.type(Article.table_name).put(self.id, {
      id: self.id,
      doi: self.doi,
      title: self.title,
      title_analyzed: self.title,
      publication_date: self.publication_date,
      abstract: self.abstract
    })
  end

  def self.create_mapping
    $index.type(Article.table_name).put_mapping({
      "#{Article.table_name}" => {:properties => {
        id: { type: "integer", index: "no" },
        title: { type: "string", index: "not_analyzed"},
        title_analyzed: { type: "string", index: "analyzed"},
        doi: { type: "string", index: "not_analyzed" },
        publication_date: { type: "date" },
        abstract: { type: "string", index: "analyzed" }
      }}
    })
  end
end
