# post :create, {article_id: article.id}, {'ACCEPT' => "application/json", "CONTENT_TYPE" => "application/json"}
require 'rails_helper'

describe "JSON API Behavior", :type => :request do
  let!(:article) { Article.create(doi: '123banana', title: 'hello world') }
  let!(:s1) { article.studies.create }
  let!(:s2) { article.studies.create }

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "create" do
    it "should allow a new blank study to be created" do
      post "/articles/#{article.id}/studies", {article_id: article.id}.to_json, {'ACCEPT' => "application/json", "CONTENT_TYPE" => "application/json"}
      response.status.should == 201
      article.reload
      article.studies.count.should == 3
    end
  end

  describe "update" do
    it "GITHUB #30, Effect Size Not Saved" do
      put "/articles/#{article.id}/studies/#{s1.id}", {
        effect_size: {'d' => 0.9}
      }.to_json, {'ACCEPT' => "application/json", "CONTENT_TYPE" => "application/json"}

      response.status.should == 200
      obj = JSON.parse(response.body)['effect_size']['d'].should == 0.9

      get "/articles/#{article.id}/studies/#{s1.id}"
      obj = JSON.parse(response.body)['effect_size']['d'].should == 0.9
    end
  end
end
