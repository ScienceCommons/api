class CreateRegistrations < ActiveRecord::Migration
  def change
    create_table :registrations do |t|
      t.text :url
      t.string :name
      t.integer :study_id
      t.integer :owner_id

      t.timestamps

    end

    add_index :registrations, :owner_id
    add_index :registrations, :study_id
  end
end
