require 'rails_helper'

describe LinksController, :type => :controller do

  let(:user) { User.create!({ :email => "ben@example.com", :curator => true }) }
  let(:user_2) { User.create!({ :email => "christian@example.com" }) }
  let!(:article) { Article.create!(doi: '123banana', title: 'hello world') }
  let!(:study) { article.studies.create!({ owner_id: user.id }) }
  let!(:study_2) { article.studies.create!({ owner_id: user_2.id }) }
  let(:link) { Link.create!(name: 'cat', url: 'dog', type: 'test', study_id: study.id) }
  let(:link_2) { Link.create!(name: 'spot', url: 'dog', type: 'test', study_id: study_2.id) }

  before(:all) do
    WebMock.disable!
  end
  after(:all) do
    WebMock.enable!
  end
  before(:each) do
    # fake :user being logged in
    [link, link_2]
    controller.stub(:current_user).and_return(user)
  end

  describe "#index" do
    it "should return the list of links for a study" do
      get :index, study_id: study.id
      results = JSON.parse(response.body)
      results.count.should == 1
      results.first['name'].should == 'cat'
    end
  end

  describe "#create" do
    it "should return a 500 if study_id not provided" do
      post :create, { url: 'foo', name: 'dog', type: 'test' }
      response.status.should == 500
    end

    it "should return a 500 if url not provided" do
      post :create, { study_id: study.id, name: 'dog', type: 'test' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['url'].should == ["can't be blank"]
    end

    it "should return a 500 if name not provided" do
      post :create, { study_id: study.id, url: 'dog', type: 'test' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['name'].should == ["can't be blank"]
    end

    it "should return a 500 if type not provided" do
      post :create, { study_id: study.id, name: 'dog', url: 'test' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['type'].should == ["can't be blank"]
    end

    it "should allow an author to be created with name, url and type" do
      post :create, { study_id: study.id, url: 'google.com', name: 'dog', type: 'test' }
      link = JSON.parse(response.body)
      link['url'].should == 'google.com'

      # we should have already indexed author in ES,
      # and be able to grab it.
      get :index, study_id: study.id
      results = JSON.parse(response.body)

      results.count.should == 2
    end
  end

  describe '#update' do
    it "should raise a 404 if link not found" do
      post :update, { id: -1 }
      response.status.should == 404
    end

    it "should allow the name to be changed" do
      post :update, { id: link.id, name: "my new name" }
      link.reload
      link.name.should == 'my new name'
    end

    it "should allow the url to be changed" do
      post :update, { id: link.id, url: "my new url" }
      link.reload
      link.url.should == 'my new url'
    end

    it "should allow the type to be changed" do
      post :update, { id: link.id, type: "my new type" }
      link.reload
      link.type.should == 'my new type'
    end

    it "should raise a 401 if user tries to link a study they did not create" do
      post :update, { id: link_2.id, name: "scotty" }
      response.status.should == 401
      link_2.reload
      link_2.name.should == 'spot'
    end
  end

  describe "#destroy" do
    it "allows an link created by current_user to be destroyed" do
      delete :destroy, { id: link.id }
      response.status.should == 204

      get :index, study_id: study.id
      results = JSON.parse(response.body)
      results.count.should == 0
    end

    it "does not allow current_user to destroy another user's link" do
      delete :destroy, { id: link_2.id }
      response.status.should == 401

      get :index, study_id: study_2.id
      results = JSON.parse(response.body)
      results.count.should == 1
    end

    it "returns a 404 if link is not found" do
      delete :destroy, { id: -1 }
      response.status.should == 404
    end
  end
end
