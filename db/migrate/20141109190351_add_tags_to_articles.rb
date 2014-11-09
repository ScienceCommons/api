class AddTagsToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :tags, :json
  end
end
