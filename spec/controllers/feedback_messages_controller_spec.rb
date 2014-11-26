require 'rails_helper'

describe FeedbackMessagesController, :type => :controller do
  let(:user) { User.create!({ :name => "bentron", :email => "ben@example.com" }) }
  before(:all) do
    WebMock.disable!
    Timecop.freeze(Time.local(1990))
  end
  after(:all) do
    WebMock.enable!
    Timecop.return
  end

  before(:each) do
    # fake :user being logged in
    controller.stub(:current_user).and_return(user)
  end

  describe "#create" do
    it "should return a 500 if message not provided" do
      UserMailer.stub(:feedback_email).and_return(double('null object').as_null_object)
      post :create, :details => {url: '/articles/123'}

      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['message'].should == ["can't be blank"]
    end

    it "should save details" do
      UserMailer.stub(:feedback_email).and_return(double('null object').as_null_object)
      post :create, :message => "Foobar", :details => {url: '/articles/123'}
      response.status.should == 201
      user.feedback_messages.count.should == 1
      user.feedback_messages.first.details['url'].should == '/articles/123'
    end

    it "should send an email" do
      UserMailer.should_receive(:feedback_email).and_return(double('null object').as_null_object)
      post :create, :message => "Foobar", :details => {url: '/articles/123'}
      response.status.should == 201
    end
  end
end
