class RenameVariablesJsonOnStudies < ActiveRecord::Migration
  def change
    remove_column :studies, :independent_variables
    rename_column :studies, :independent_variables_json, :independent_variables
    remove_column :studies, :dependent_variables
    rename_column :studies, :dependent_variables_json, :dependent_variables
  end
end
