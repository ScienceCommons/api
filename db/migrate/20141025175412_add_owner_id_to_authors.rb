class AddOwnerIdToAuthors < ActiveRecord::Migration
  def change
    add_column :authors, :owner_id, :integer
    add_index :authors, :owner_id
  end
end
