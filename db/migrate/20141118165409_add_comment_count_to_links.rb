class AddCommentCountToLinks < ActiveRecord::Migration
  def change
    add_column :links, :comment_count, :integer, default: 0
  end
end
