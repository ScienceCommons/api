class CreateArticles < ActiveRecord::Migration
  def change

    create_table :articles do |t|
      t.string :doi, null: false
      t.string :title, null: false
      t.integer :journal_id
      t.date :publication_date
      t.string :abstract, defaut: ''

      # Aggregate metrics calculated for
      # articles.
      t.float :repeatability, default: 0
      t.float :materials, default: 0
      t.float :quality_of_stats, default: 0
      t.float :disclosure, default: 0

      t.timestamps
    end

    add_index :articles, :doi, unique: true
    add_index :articles, :journal_id
    add_index :articles, :publication_date
  end
end
