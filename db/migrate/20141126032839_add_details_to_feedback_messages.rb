class AddDetailsToFeedbackMessages < ActiveRecord::Migration
  def change
    add_column :feedback_messages, :details, :json
  end
end
