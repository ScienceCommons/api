class CreateClients < ActiveRecord::Migration
  def self.up
    create_table :clients do |t|
      t.string :identifier, :secret, :name
      t.timestamps
    end

    add_index :clients, :identifier, :unique => true
    add_index :clients, :name, :unique => true
  end

  def self.down
    drop_table :clients
  end
end
