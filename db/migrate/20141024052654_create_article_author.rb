class CreateArticleAuthor < ActiveRecord::Migration
  def change
    create_table :article_authors do |t|
      t.integer :article_id
      t.integer :author_id

      t.timestamps
    end

    add_index :article_authors, :article_id
    add_index :article_authors, :author_id
  end
end
