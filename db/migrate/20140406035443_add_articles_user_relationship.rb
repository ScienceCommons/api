class AddArticlesUserRelationship < ActiveRecord::Migration
  def change
    add_column :articles, :authors_denormalized, :text
  end
end
