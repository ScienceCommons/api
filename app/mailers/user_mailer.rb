class UserMailer < ActionMailer::Base
  default delivery_method: :ses
  default from: "help@curatescience.org"

  def invite_email(to_email, from_user)
    @from_user = from_user
    @from_name = from_user.name || from_user.email
    @invite_url = INVITE_URL
    mail(to: to_email, subject: "#{@from_name} has invited you to CurateScience")
  end

  def feedback_email(feedback_message)
    @feedback_message = feedback_message
    @from_user = @feedback_message.user
    @from_name = @from_user.name || @from_user.email
    mail(to: "stephen@curatescience.org", subject: "Feedback from #{@from_name}")
  end
end
