class AddUserToArticles < ActiveRecord::Migration
  def change
    add_column :articles, :updater_id, :integer
    add_index :articles, :updater_id
  end
end
