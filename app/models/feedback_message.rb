class FeedbackMessage < ActiveRecord::Base
  belongs_to :user
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :user_id
  validates_presence_of :message

  before_save :set_defaults
  after_create :send_email

  private

  def set_defaults
    self.details ||= {}
  end

  def send_email
    UserMailer.feedback_email(self).deliver!
  end
end
