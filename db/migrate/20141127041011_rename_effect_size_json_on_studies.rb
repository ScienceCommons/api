class RenameEffectSizeJsonOnStudies < ActiveRecord::Migration
  def change
    remove_column :studies, :effect_size
    rename_column :studies, :effect_size_json, :effect_size
  end
end
