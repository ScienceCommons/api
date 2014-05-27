class AddOwnerToFindings < ActiveRecord::Migration
  def change
    add_column :findings, :owner_id, :integer
    add_index :findings, :owner_id
  end
end
