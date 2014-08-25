class Invite < ActiveRecord::Base
  validates_uniqueness_of :email
  belongs_to :inviter, :class_name => 'User', :foreign_key => :inviter_id

  def send_invite
    UserMailer.invite_email(self.email, self.inviter).deliver!
  end
end
