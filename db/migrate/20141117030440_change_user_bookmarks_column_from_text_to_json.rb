class ChangeUserBookmarksColumnFromTextToJson < ActiveRecord::Migration
  def change
    remove_column :users, :bookmarks
    add_column :users, :bookmarks, :json
  end
end
