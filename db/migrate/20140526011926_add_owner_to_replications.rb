class AddOwnerToReplications < ActiveRecord::Migration
  def change
    add_column :replications, :owner_id, :integer
    add_index :replications, :owner_id
  end
end
