require 'rails_helper'

describe CommentsController, :type => :controller do
  let(:user) do
    User.create!({
      :name => "bentron",
      :email => "ben@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end

  let(:admin_user) do
    User.create!({
      :name => "ben",
      :email => "ben+admin@example.com",
      :password => "11111111",
      :password_confirmation => "11111111",
      :admin => true
    })
  end

  let(:article) do
    article = Article.create(doi: '123banana', title: 'hello world', owner_id: user.id, updated_at: '2006-03-05')
    article.add_comment(user.id, "Foo", "fooField")
    article.add_comment(user.id, "Bar")
    article.add_comment(admin_user.id, "Admin comment")
    article
  end

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

  describe "#index" do
    it "should return the list of comments" do
      get :index, :commentable_type => "articles", :commentable_id => article.id
      results = JSON.parse(response.body)
      results.count.should == 3
    end

    it "should return the list of comments for a field" do
      get :index, :commentable_type => "articles", :commentable_id => article.id, :field => "fooField"
      results = JSON.parse(response.body)
      results.count.should == 1
    end
  end

  describe "#show" do
    it "should return the comment corresponding to the id" do
      comment = article.comments.first
      get :show, id: comment.id
      JSON.parse(response.body)['id'].should == comment.id
    end

    it "should return a 404 if the comment is not found" do
      get :show, id: -1
      response.status.should == 404
    end
  end

  describe "#create" do
    it "should return a 500 if comment is not provided" do
      post :create, :commentable_type => "articles", :commentable_id => article.id
      response.status.should == 500
    end

    it "should allow a comment to be created" do
      post :create, :commentable_type => "articles", :commentable_id => article.id, :comment => "my comment"
      response.status.should == 201

      comment = JSON.parse(response.body)
      comment['comment'].should == 'my comment'
      get :index, :commentable_type => "articles", :commentable_id => article.id
      results = JSON.parse(response.body)
      results.count.should == 4
    end

    it "should set the owner when creating a comment" do
      post :create, :commentable_type => "articles", :commentable_id => article.id, :comment => "my comment"
      comment = JSON.parse(response.body)
      comment['owner_id'].should == user.id
    end

    it "should set whether the comment is anonymous when creating a comment" do
      post :create, :commentable_type => "articles", :commentable_id => article.id, :comment => "my comment"
      comment = JSON.parse(response.body)
      comment['anonymous'].should == false
    end
  end

  describe "#destroy" do
    it "allows an comment created by current_user to be destroyed" do
      comment = article.comments.first
      delete :destroy, id: comment.id
      response.status.should == 204

      get :index, :commentable_type => "articles", :commentable_id => article.id
      results = JSON.parse(response.body)
      results.count.should == 2
    end

    it "allows an comment to be destroyed by an admin" do
      controller.stub(:current_user).and_return(admin_user)
      comment = article.comments.first
      delete :destroy, id: comment.id
      response.status.should == 204

      get :index, :commentable_type => "articles", :commentable_id => article.id
      results = JSON.parse(response.body)
      results.count.should == 2
    end

    it "does not allow current_user to destroy another user's article" do
      comment = article.comments.last
      delete :destroy, id: comment.id
      response.status.should == 401

      get :index, :commentable_type => "articles", :commentable_id => article.id
      results = JSON.parse(response.body)
      results.count.should == 3
    end

    it "returns a 404 if comment is not found" do
      delete :destroy, id: -1
      response.status.should == 404
    end
  end
end
