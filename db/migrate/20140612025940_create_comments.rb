class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :commentable_id
      t.string :commentable_type
      t.text :comment
      t.string :field
      t.integer :owner_id
      t.integer :comment_count, default: 0

      t.timestamps
    end

    add_index :comments, :commentable_id
    add_index :comments, :commentable_type
    add_index :comments, :owner_id
    add_index :comments, :field
    add_index :comments, :created_at
  end
end
