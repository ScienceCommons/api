require 'rails_helper'

describe SessionsController, :type => :controller do
  include Devise::TestHelpers

  before do
    request.env["devise.mapping"] = Devise.mappings[:user]
  end

# TODO: add a colum to user that allows for
# the claiming of an account.
=begin
  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end

  let(:user2) do
    User.create!({
      :email => "ben2@example.com",
      :password => "f662c13e-0a4d-11e4-a0d0-b2227cce2b54",
      :password_confirmation => "f662c13e-0a4d-11e4-a0d0-b2227cce2b54"
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

      response.status.should == 201
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

    it "should return a 401 if username password is PLACEHOLDER_PASSWORD" do
      post :create, {
        user: {
          email: user2.email,
          password: user2.password
        }
      }

      response.status.should == 401
    end
  end
=end
end
