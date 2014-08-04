class AddInvitesToUser < ActiveRecord::Migration
  def change
    add_column :users, :invite_count, :integer, default: 0
  end
end
