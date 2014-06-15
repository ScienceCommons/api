# post :create, {article_id: article.id}, {'ACCEPT' => "application/json", "CONTENT_TYPE" => "application/json"}
require 'spec_helper'

describe "JSON API Behavior" do
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
end
