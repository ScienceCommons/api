class AddEffectSizeJsonToStudies < ActiveRecord::Migration
  def change
    add_column :studies, :effect_size_json, :json
  end
end
