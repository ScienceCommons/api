class AddNumberToStudy < ActiveRecord::Migration
  def change
    add_column :studies, :number, :string
  end
end
