class CreateInvites < ActiveRecord::Migration
  def change
    create_table :invites do |t|
      t.integer :invite_id
      t.integer :inviter
      t.string :email, null: false, default: ""

      t.timestamps
    end

    add_index :invites, :inviter
    add_index :invites, :email
  end
end
