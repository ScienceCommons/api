class AddCommentCountToArticle < ActiveRecord::Migration
  def change
    add_column :articles, :comment_count, :integer, default: 0
  end
end
