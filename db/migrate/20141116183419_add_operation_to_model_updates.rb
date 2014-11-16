class AddOperationToModelUpdates < ActiveRecord::Migration
  def change
    add_column :model_updates, :operation, :integer, :null => false
  end
end
