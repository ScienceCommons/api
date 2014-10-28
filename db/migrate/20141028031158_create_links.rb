class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.integer :study_id
      t.string :name
      t.string :url
      t.string :type

      t.timestamps
    end

    add_index :links, :study_id
    add_index :links, :type
  end
end
