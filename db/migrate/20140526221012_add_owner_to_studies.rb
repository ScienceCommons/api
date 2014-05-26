class AddOwnerToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :owner_id, :integer
    add_index :studies, :owner_id
  end
end
