class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.integer :user_id

      t.string :provider, null: false, default: ""
      t.string :uid, null: false, default: ""
      
      t.timestamps
    end

    add_index :accounts, :user_id
    add_index :accounts, :uid
  end
end
