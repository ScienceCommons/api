class AddAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.string :orcid
      t.string :job_title
      t.integer :user_id
      t.integer :same_as_id
      t.json :affiliations

      t.timestamps
    end

    add_index :authors, :user_id
    add_index :authors, :orcid
    add_index :authors, :same_as_id
  end
end
