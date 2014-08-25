require "rails_helper"

RSpec.describe UserMailer, :type => :mailer do

  before(:all) { WebMock.disable! }
  let(:user) do
    User.create!({
      :email => "ben@example.com"
    })
  end
  let(:user2) do
    User.create!({
      :email => "ben@example.com",
      :name => "Ben Coe"
    })
  end

  describe "invite_email" do
    it "should add inviters email to subject if user has no name" do
      email = UserMailer.invite_email('battista.christian@example.com', user)
      email.subject.should =~ /ben@example.com/
    end

    it "send invite to appropriate email" do
      email = UserMailer.invite_email('battista.christian@example.com', user2)
      email.to.should == ['battista.christian@example.com']
    end

    it "should add invites name to subject if user has name" do
      email = UserMailer.invite_email('battista.christian@example.com', user2)
      email.subject.should =~ /Ben Coe/
    end

    it "should include inviter's name in invite" do
      email = UserMailer.invite_email('battista.christian@example.com', user2)
      email.body.to_s.should =~ /Ben Coe/
    end

    it "should include signup URL in email" do
      email = UserMailer.invite_email('battista.christian@example.com', user2)
      email.body.to_s.should =~ /#{INVITE_URL}/
    end

  end
end
