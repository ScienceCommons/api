require 'spec_helper'

describe SessionsController do
  include Devise::TestHelpers

  before do
    request.env["devise.mapping"] = Devise.mappings[:user]
  end

  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end

  describe "create" do
    it "should create a session for a user if login is correct" do
      post :create, {
        user: {
          email: user.email,
          password: user.password
        }
      }

      response.status.should == 200
    end

    it "should return 401 if password is incorrect" do
      post :create, {
        user: {
          email: user.email,
          password: 'fakepass'
        }
      }

      response.status.should == 401
    end
  end
end
