require 'rails_helper'

describe RegistrationsController, :type => :controller do
  let!(:article) { Article.create(doi: '123banana', title: 'hello world') }
  let!(:article_no_registrations) { Article.create(doi: '1234banana', title: 'hello world') }
  let!(:s1) { article.studies.create }
  let!(:s2) { article_no_registrations.studies.create }

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

  let!(:r1) { s1.registrations.create(url: 'www.example.com', name: 'registrations.txt', owner_id: user.id) }
  let!(:r2) { s1.registrations.create(url: 'www.example2.com', name: 'registrations2.txt', owner_id: user_2.id) }
  let!(:r3) { s1.registrations.create(url: 'www.example3.com', name: 'registrations3.txt') }

  let(:time_in_past) { 1400463719 }

  before(:each) do
  # fake :user being logged in
  controller.stub(:current_user).
    and_return(user)
  end

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "#index" do
    it "should return all registrations for a given study" do
      get :index, article_id: article.id, study_id: s1.id
      response.status.should == 200
      registrations = JSON.parse(response.body)
      registrations.count.should == 3
      registrations.should include(JSON.parse(r1.to_json))
      registrations.should include(JSON.parse(r2.to_json))
    end

    it "should return all registrations given a study id" do
      get :index, study_id: s1.id
      response.status.should == 200
      registrations = JSON.parse(response.body)
      registrations.count.should == 3
      registrations.should include(JSON.parse(r1.to_json))
      registrations.should include(JSON.parse(r2.to_json))
    end

  end

  describe "#show" do
    it "should return a specific registration" do
      get :show, article_id: article.id, study_id: s1.id, id: r1.id
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(r1.to_json)
    end

    it "should return a specific registration with only a study id" do
      get :show, study_id: s1.id, id: r1.id
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(r1.to_json)
    end
  end

  describe "#create" do

    it "should allow a new registration to be created" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        url: 'www.zombocom.com',
        name: 'awesome.txt'
      }

      response.status.should == 201
      registration = JSON.parse(response.body)
      s1.reload
      s1.registrations.count.should == 4
      registration['url'].should == 'http://www.zombocom.com'
      registration['name'].should == 'awesome.txt'
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
        id: r1.id,
        url: 'http://zombocom.com',
        name: 'awesome.txt'
      }
      response.status.should == 200
      r1.reload
      r1.url.should == 'http://zombocom.com'
      r1.name.should == 'awesome.txt'
    end

    it "should allow name and url to be updated with just a study_id" do
      post :update, {
        study_id: s1.id,
        id: r1.id,
        url: 'http://zombocom.com',
        name: 'awesome.txt'
      }
      response.status.should == 200
      r1.reload
      r1.url.should == 'http://zombocom.com'
      r1.name.should == 'awesome.txt'
    end

    it "should allow name to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: r1.id,
        name: 'awesome.txt'
      }
      response.status.should == 200
      r1.reload
      r1.url.should == 'http://www.example.com'
      r1.name.should == 'awesome.txt'
    end

    it "should allow url to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: r1.id,
        url: 'http://www.foo.com'
      }
      response.status.should == 200
      r1.reload
      r1.url.should == 'http://www.foo.com'
      r1.name.should == 'registrations.txt'
    end
  end

  describe '#destroy' do
    it "allows a user to delete registrations that they create" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: r1.id
      }
      Registration.all.count.should == 2
    end

    it "does not allow a user to delete registrations that they did not create" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: r2.id
      }
      response.status.should == 401
      Registration.all.count.should == 3
    end

    it "allows a user to delete registrations with no owner" do
      delete :destroy, {
        article_id: article.id,
        study_id: s1.id,
        id: r3.id
      }
      Registration.all.count.should == 2
    end
  end

end
