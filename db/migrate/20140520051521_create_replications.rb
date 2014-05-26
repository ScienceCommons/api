class CreateReplications < ActiveRecord::Migration
  def change
    create_table :replications do |t|
      t.integer :study_id
      t.integer :replicating_study_id
      t.integer :closeness

      t.timestamps
    end

    add_index :replications, :study_id
    add_index :replications, :replicating_study_id
  end
end
