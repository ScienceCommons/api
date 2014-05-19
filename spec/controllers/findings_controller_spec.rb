require 'spec_helper'

describe FindingsController do
  let!(:article) { Article.create(doi: '123banana', title: 'hello world') }
  let!(:article_no_findings) { Article.create(doi: '1234banana', title: 'hello world') }
  let!(:s1) { article.studies.create }
  let!(:s2) { article_no_findings.studies.create }
  let!(:f1) { s1.findings.create(url: 'www.example.com', name: 'finding.txt') }
  let!(:f2) { s1.findings.create(url: 'www.example2.com', name: 'finding2.txt') }

  let(:time_in_past) { 1400463719 }

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "index" do
    it "should return all findings for a given study" do
      get :index, article_id: article.id, study_id: s1.id
      response.status.should == 200
      findings = JSON.parse(response.body)
      findings.count.should == 2
      findings.should include(JSON.parse(f1.to_json))
      findings.should include(JSON.parse(f2.to_json))
    end

    it "should return an empty array if no findings exist" do
      get :index, article_id: article_no_findings.id, study_id: s2.id
      response.status.should == 200
      findings = JSON.parse(response.body)
      findings.count.should == 0
      findings.kind_of?(Array).should == true
    end

    it "should raise a 404 if article or study not found" do
      get :index, article_id: 'banana', study_id: 'apple'
      response.status.should == 404

      get :index, article_id: article.id, study_id: 'banana'
      response.status.should == 404
    end

    it "should raise a 500 if no article_id is provided" do
      get :index
      response.status.should == 500
    end

    it "should raise a 500 if no study_id is provided" do
      get :index, article_id: article.id
      response.status.should == 500
    end
  end

  describe "show" do
    it "should return a specific finding" do
      get :show, article_id: article.id, study_id: s1.id, id: f1.id
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(f1.to_json)
    end

    it "should return created_at as an integer epoch" do
      get :show, article_id: article.id, study_id: s1.id, id: f1.id
      finding = JSON.parse(response.body)
      finding['created_at'].should > time_in_past
    end

    it "should return updated_at as an integer epoch" do
      get :show, article_id: article.id, study_id: s1.id, id: f1.id
      finding = JSON.parse(response.body)
      finding['updated_at'].should > time_in_past
    end
  end

  describe "create" do
    it "should allow a new finding to be created" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        url: 'www.zombocom.com',
        name: 'awesome.txt'
      }

      response.status.should == 200
      finding = JSON.parse(response.body)
      s1.reload
      s1.findings.count.should == 3
      finding['url'].should == 'http://www.zombocom.com'
      finding['name'].should == 'awesome.txt'
    end

    it "should raise a 500 if name is not provided" do
      post :create, {
        article_id: article.id,
        study_id: s1.id,
        url: 'www.zombocom.com'
      }
      response.status.should == 500
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

  describe 'update' do
    it "should allow name and url to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: f1.id,
        url: 'http://zombocom.com',
        name: 'awesome.txt'
      }
      response.status.should == 200
      f1.reload
      f1.url.should == 'http://zombocom.com'
      f1.name.should == 'awesome.txt'
    end

    it "should allow name to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: f1.id,
        name: 'awesome.txt'
      }
      response.status.should == 200
      f1.reload
      f1.url.should == 'http://www.example.com'
      f1.name.should == 'awesome.txt'
    end

    it "should allow url to be updated" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: f1.id,
        url: 'http://www.foo.com'
      }
      response.status.should == 200
      f1.reload
      f1.url.should == 'http://www.foo.com'
      f1.name.should == 'finding.txt'
    end

    it "should raise a 500 if url is updated with invalid url" do
      post :update, {
        article_id: article.id,
        study_id: s1.id,
        id: f1.id,
        url: 'zombocom'
      }
      response.status.should == 500
      f1.reload
      f1.url.should == 'http://www.example.com'
      f1.name.should == 'finding.txt'
    end

  end
end
