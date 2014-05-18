class CreateStudies < ActiveRecord::Migration
  def change
    create_table :studies do |t|
      t.text :independent_variables
      t.text :dependent_variables
      t.integer :n
      t.integer :article_id
      t.float :power
      t.text :effect_size

      t.timestamps
    end

    add_index :studies, :article_id
  end
end
