class CreateFeedbackMessages < ActiveRecord::Migration
  def change
    create_table :feedback_messages do |t|
      t.integer :user_id, null: false
      t.text :message, null: false
      t.references :commentable, polymorphic: true
      t.timestamps
    end
    add_index :feedback_messages, :user_id
  end
end
