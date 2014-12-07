class AddPrimaryCommentableTypeAndIdToComments < ActiveRecord::Migration
  def change
    add_column :comments, :primary_commentable_id, :integer
    add_column :comments, :primary_commentable_type, :string
    add_index :comments, :primary_commentable_id
    add_index :comments, :primary_commentable_type
  end
end
