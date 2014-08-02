class DropJournalId < ActiveRecord::Migration
  def change
    remove_column :articles, :journal_id
  end
end
