class Invite < ActiveRecord::Base
  validates_uniqueness_of :email
  belongs_to :inviter, :class_name => 'User', :foreign_key => :inviter_id

  def send_invite
    # we should totes write the logic that does this.
  end
end
