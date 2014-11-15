class CreateModelUpdates < ActiveRecord::Migration
  def change
    create_table :model_updates do |t|
      t.references :changeable, polymorphic: true
      t.json :model_changes, null: false
      t.integer :submitter_id, null: false
      t.integer :approver_id
      t.boolean :approved, default: false
      t.boolean :rejected, default: false
      t.text :reason
      t.text :rejected_reason

      t.timestamps
    end

    add_index :model_updates, [:changeable_id, :changeable_type]
    add_index :model_updates, :submitter_id
    add_index :model_updates, :approver_id
  end
end
