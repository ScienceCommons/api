class AllowArticleDoiToBeNull < ActiveRecord::Migration
  def change
    change_column_null :articles, :doi, true
  end
end
