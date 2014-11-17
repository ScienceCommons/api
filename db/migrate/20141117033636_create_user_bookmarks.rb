class CreateUserBookmarks < ActiveRecord::Migration
  def change
    remove_column :users, :bookmarks
    
    create_table :user_bookmarks do |t|
      t.references :bookmarkable, polymorphic: true
      t.integer :user_id, null: false
      t.text :notes

      t.timestamps
    end

    add_index :user_bookmarks, [:bookmarkable_id, :bookmarkable_type]
    add_index :user_bookmarks, :user_id
  end
end
