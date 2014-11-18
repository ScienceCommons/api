class AddCommentCountToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :comment_count, :integer, default: 0
  end
end
