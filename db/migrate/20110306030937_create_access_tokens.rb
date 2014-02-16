class CreateAccessTokens < ActiveRecord::Migration
  def self.up
    create_table :access_tokens do |t|
      t.belongs_to :client, :refresh_token
      t.string :token
      t.datetime :expires_at
      t.timestamps
    end

    add_index :access_tokens, :token, :unique => true
    add_index :access_tokens, :expires_at
  end

  def self.down
    drop_table :access_tokens
  end
end
