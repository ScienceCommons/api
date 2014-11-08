class ArticleAuthor < ActiveRecord::Base
  belongs_to :article
  belongs_to :author

  validates_uniqueness_of :author_id, :scope => :article_id
end
