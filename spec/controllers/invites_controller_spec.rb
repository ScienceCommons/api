require 'rails_helper'

describe InvitesController, :type => :controller do
  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :invite_count => 3
    })
  end
  let(:user2) do
    User.create!({
      :email => "christian@example.com"
    })
  end

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "#create" do
    it "should return 200 and attempt to send invite" do
      # return a user with invits
      controller.stub(:current_user).and_return(user)

      User.any_instance.should_receive(:send_invite).with('foo@example.com')

      post :create, { email: 'foo@example.com' }

      response.status.should == 201
    end

    it "should return a 500 if user has no invites left" do
      # return a user with invits
      controller.stub(:current_user).and_return(user2)

      post :create, { email: 'foo@example.com' }

      response.status.should == 500
      response.body.should =~ /no invites remaining/
    end

    it "should return a 401 not authorized if user not logged in" do
      post :create, { email: 'foo@example.com' }
      User.any_instance.should_not_receive(:send_invite).with('foo@example.com')
      response.status.should == 401
    end
  end
end
