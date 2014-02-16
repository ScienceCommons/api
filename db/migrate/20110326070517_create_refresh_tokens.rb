class CreateRefreshTokens < ActiveRecord::Migration
  def self.up
    create_table :refresh_tokens do |t|
      t.belongs_to :client
      t.string :token
      t.datetime :expires_at
      t.timestamps
    end

    add_index :refresh_tokens, :token, :unique => true
  end

  def self.down
    drop_table :refresh_tokens
  end
end
