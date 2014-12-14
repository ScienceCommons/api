require 'rails_helper'

describe OauthSessionsController, :type => :controller do

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :invite_count => 3
    })
  end

  before(:each) do
    request.env["omniauth.auth"] = {}
    Account.stub(:find_by_provider_and_uid).and_return(nil)
  end

  describe "#create" do
    it "should redirect to request invite page if email not in invite list" do
      User.should_receive(:create_with_omniauth)
        .and_raise(Exceptions::NotOnInviteList.new)
      post :create
      response.should redirect_to('/#section-6')
    end

    it "should redirect to beta page if session is created successfully" do
      User.should_receive(:create_with_omniauth)
        .and_return(user)
      post :create
      response.should redirect_to('/beta/#/')
    end
  end
end
