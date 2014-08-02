class AddJournalTitleIssn < ActiveRecord::Migration
  def change
    add_column :articles, :journal_title, :text
    add_column :articles, :journal_issn, :string

    add_index :articles, :journal_title
    add_index :articles, :journal_issn
  end
end
