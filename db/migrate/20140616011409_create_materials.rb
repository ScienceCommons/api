class CreateMaterials < ActiveRecord::Migration
  def change
    create_table :materials do |t|
      t.text :url
      t.string :name
      t.integer :study_id
      t.integer :owner_id

      t.timestamps
    end

    add_index :materials, :owner_id
    add_index :materials, :study_id
  end
end
