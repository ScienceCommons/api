class CreateFindings < ActiveRecord::Migration
  def change
    create_table :findings do |t|
      t.text :url
      t.string :name
      t.integer :study_id

      t.timestamps
    end

    add_index :findings, :study_id
  end
end
