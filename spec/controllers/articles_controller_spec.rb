require 'spec_helper'

describe ArticlesController do
  let(:article) { Article.create(doi: '123banana', title: 'hello world') }
  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  describe "show" do
    it "should return the article corresponding to the id" do
      get :show, id: article.id
      JSON.parse(response.body)['id'].should == article.id
    end
  end
end
