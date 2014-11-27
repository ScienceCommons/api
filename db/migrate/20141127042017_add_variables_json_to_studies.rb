class AddVariablesJsonToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :dependent_variables_json, :json
    add_column :studies, :independent_variables_json, :json
  end
end
