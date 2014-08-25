require 'rails_helper'

describe MaterialsController, :type => :controller do
  let!(:article) { Article.create(doi: '123banana', title: 'hello world') }
  let!(:article_no_materials) { Article.create(doi: '1234banana', title: 'hello world') }
  let!(:s1) { article.studies.create }
  let!(:s2) { article_no_materials.studies.create }

  let(:user) do
    User.create!({
      :email => "ben@example.com"
    })
  end
  let(:user_2) do
    User.create!({
      :email => "christian@example.com"
    })
  end

  let!(:m1) { s1.materials.create(url: 'www.example.com', name: 'materials.txt', owner_id: user.id) }
  let!(:m2) { s1.materials.create(url: 'www.example2.com', name: 'materials2.txt', owner_id: user_2.id) }
  let!(:m3) { s1.materials.create(url: 'www.example3.com', name: 'materials3.txt') }

  let(:time_in_past) { 1400463719 }

  before(:each) do
  # fake :user being logged in
  controller.stub(:current_user).
    and_return(user)
  end

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "#index" do
    it "should return all materials for a given study" do
      get :index, article_id: article.id, study_id: s1.id
      response.status.should == 200
      materials = JSON.parse(response.body)
      materials.count.should == 3
      materials.should include(JSON.parse(m1.to_json))
      materials.should include(JSON.parse(m2.to_json))
    end

    it "should return all materials given a study id" do
      get :index, study_id: s1.id
      response.status.should == 200
      materials = JSON.parse(response.body)
      materials.count.should == 3
      materials.should include(JSON.parse(m1.to_json))
      materials.should include(JSON.parse(m2.to_json))
    end

  end

  describe "#show" do
    it "should return a specific material" do
      get :show, article_id: article.id, study_id: s1.id, id: m1.id
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(m1.to_json)
    end

    it "should return a specific material with only a study id" do
      get :show, study_id: s1.id, id: m1.id
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(m1.to_json)
    end
  end

  describe "#create" do

    it "should allow a new material to be created" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        url: 'www.zombocom.com',
        name: 'awesome.txt'
      }

      response.status.should == 201
      material = JSON.parse(response.body)
      s1.reload
      s1.materials.count.should == 4
      material['url'].should == 'http://www.zombocom.com'
      material['name'].should == 'awesome.txt'
    end

    it "should raise a 500 if url is not provided" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        name: 'awesome.txt'
      }
      response.status.should == 500
    end

    it "should raise a 500 if url is invalid" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        url: 'zombocom',
        name: 'awesome.txt'
      }
      response.status.should == 500
    end
  end

  describe '#update' do
    it "should allow name and url to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: m1.id,
        url: 'http://zombocom.com',
        name: 'awesome.txt'
      }
      response.status.should == 200
      m1.reload
      m1.url.should == 'http://zombocom.com'
      m1.name.should == 'awesome.txt'
    end

    it "should allow name and url to be updated with just a study_id" do
      post :update, {
        study_id: s1.id,
        id: m1.id,
        url: 'http://zombocom.com',
        name: 'awesome.txt'
      }
      response.status.should == 200
      m1.reload
      m1.url.should == 'http://zombocom.com'
      m1.name.should == 'awesome.txt'
    end

    it "should allow name to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: m1.id,
        name: 'awesome.txt'
      }
      response.status.should == 200
      m1.reload
      m1.url.should == 'http://www.example.com'
      m1.name.should == 'awesome.txt'
    end

    it "should allow url to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: m1.id,
        url: 'http://www.foo.com'
      }
      response.status.should == 200
      m1.reload
      m1.url.should == 'http://www.foo.com'
      m1.name.should == 'materials.txt'
    end
  end

  describe '#destroy' do
    it "allows a user to delete materials that they create" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: m1.id
      }
      Material.all.count.should == 2
    end

    it "does not allow a user to delete materials that they did not create" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: m2.id
      }
      response.status.should == 401
      Material.all.count.should == 3
    end

    it "allows a user to delete materials with no owner" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: m3.id
      }
      Material.all.count.should == 2
    end
  end

end
