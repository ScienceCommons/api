class AddIndexesToArticleDates < ActiveRecord::Migration
  def change
    add_index :articles, :created_at
    add_index :articles, :updated_at
  end
end
