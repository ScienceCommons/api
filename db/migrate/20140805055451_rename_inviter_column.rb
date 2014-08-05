class RenameInviterColumn < ActiveRecord::Migration
  def change
    rename_column :invites, :inviter, :inviter_id
  end
end
