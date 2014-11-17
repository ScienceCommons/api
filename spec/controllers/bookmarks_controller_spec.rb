require 'rails_helper'

describe BookmarksController, :type => :controller do
  let(:user) { User.create!({ :email => "ben@example.com" }) }
  let(:article) { Article.create(doi: '123banana', title: 'hello world', owner_id: user.id, updated_at: '2006-03-05') }
  let(:article2) { Article.create(doi: '123banana23', title: 'hello world23', owner_id: user.id) }
  let(:bookmark) { user.bookmarks.create!(bookmarkable: article) }

  before(:all) do
    WebMock.disable!
    Timecop.freeze(Time.local(1990))
  end
  after(:all) do
    WebMock.enable!
    Timecop.return
  end

  before :each do
    # fake :user being logged in
    controller.stub(:current_user).and_return(user)
  end

  describe "#index" do
    it "should return the list of bookmarks for a user" do
      bookmark # call the let to create it in the DB
      get :index
      response.status.should == 200
      results = JSON.parse(response.body)
      results.count.should == 1
    end
  end

  describe "#show" do
    it "should return the details of a single bookmark" do
      get :show, :id => bookmark.id
      response.status.should == 200
      results = JSON.parse(response.body)
      results["bookmarkable_id"].should == article.id
      results["bookmarkable_type"].should == "Article"
    end
  end

  describe "#create" do
    it "should allow a user to add a bookmark" do
      post :create, :bookmarkable_type => "article", :bookmarkable_id => article2.id
      response.status.should == 201
      results = JSON.parse(response.body)
      results["bookmarkable_id"].should == article2.id
      results["bookmarkable_type"].should == "Article"
      results["user_id"].should == user.id
    end
  end

  describe "#destroy" do
    it "should remove a bookmark" do
      delete :destroy, :id => bookmark.id
      response.status.should == 204
    end
  end
end
