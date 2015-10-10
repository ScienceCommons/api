require "mandrill"

class MandrillMailer < ActionMailer::Base
  default from: "Curate Science Team <support@curatescience.org>"

  def welcome(user)
    subject = "Welcome to Curate Science!"
    merge_vars = {
      "SUBJECT" => "Welcome to Curate Science!",
      "CURRENT_YEAR" => Time.now.year
    }
    body = mandrill_template("welcome-email", merge_vars)
    send_mail(user.email, subject, body)
  end

  private

  def send_mail(email, subject, body)
    mail(to: email, subject: subject, body: body, content_type: "text/html")
  end

  def mandrill_template(template_name, attributes)
    mandrill = Mandrill::API.new(ENV["SMTP_PASSWORD"])

    merge_vars = attributes.map do |key, value|
      { name: key, content: value }
    end

    mandrill.templates.render(template_name, [], merge_vars)["html"]
  end
end
