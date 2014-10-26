class AddNumberToArticleAuthors < ActiveRecord::Migration
  def change
    add_column :article_authors, :number, :integer
  end
end
