class AddOwnerToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :owner_id, :integer
    add_index :articles, :owner_id
  end
end
