require 'spec_helper'

describe ArticlesController do

  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end
  let(:user_2) do
    User.create!({
      :email => "christian@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end
  let(:article) { Article.create(doi: '123banana', title: 'hello world', owner_id: user.id) }
  let(:article_2) { Article.create(doi: '123apple', title: 'awesome article', owner_id: user_2.id) }
  before(:all) do
    WebMock.disable!
    Timecop.freeze(Time.local(1990))
  end
  after(:all) do
    WebMock.enable!
    Timecop.return
  end
  before(:each) do
    # reset ES index, and make sure
    # testing articles are indexed.
    reset_index
    Article.put_mapping
    [article, article_2]
    ElasticMapper.index.refresh

    # fake :user being logged in
    controller.stub(:current_user).
      and_return(user)
  end

  describe "#index" do
    it "should return the list of articles" do
      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 2
      results['total'].should == 2
    end
  end

  describe "#show" do
    it "should return the article corresponding to the id" do
      get :show, id: article.id
      JSON.parse(response.body)['id'].should == article.id
    end

    it "should return a 404 if article not found" do
      get :show, id: -1
      response.status.should == 404
    end
  end

  describe "#create" do
    it "should return a 500 if title not provided" do
      post :create, { doi: 'abc123' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['title'].should == ["can't be blank"]
    end

    # we might eventually automatically create a DOI
    # if none is provided.
    it "should return a 500 if DOI is not provided" do
      post :create, { title: 'my awesome title' }
      response.status.should == 500
      err = JSON.parse(response.body)
      err['messages']['doi'].should == ["can't be blank"]
    end

    it "should allow an article to be created with DOI and title" do
      post :create, { title: 'my awesome title', doi: 'abc555' }
      article = JSON.parse(response.body)
      article['publication_date'].should == '1990-01-01'

      # we should have already indexed article in ES,
      # and be able to grab it.
      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 3
      results['total'].should == 3
    end

    it "should allow publication_date to be set when creating an article" do
      # publication date is in format year-month-day,
      # the problem with a timestamp is that if the user
      # is in a country in a different time-zone,
      # publication_date could be off by a day.
      post :create, {
        title: 'my awesome title',
        doi: 'abc555',
        publication_date: '2006-3-5'
      }
      article = JSON.parse(response.body)
      article['publication_date'].should == '2006-03-05'
    end

    it "should allow authors to be set when creating an article" do
      post :create, {
        title: 'my new awesome title',
        doi: '111111',
        authors: [{
          first_name: 'Ben',
          middle_name: 'E.',
          last_name: 'Coe'
        }, {
          first_name: 'Christian',
          middle_name: 'J.',
          last_name: 'Battista'
        }]
      }
      article = Article.find_by_doi('111111')
      article.authors_denormalized.should include({
        first_name: 'Christian',
        middle_name: 'J.',
        last_name: 'Battista'
      })
    end

    it "should set the owner when creating an article" do
      post :create, { title: 'my awesome title', doi: 'abc555' }
      article = Article.find_by_doi('abc555')
      article.owner.should == user
    end
  end

  describe '#update' do
    it "should raise a 404 if article not found" do
      post :update, { id: -1 }
      response.status.should == 404
    end

    it "should allow the title to be changed" do
      post :update, { id: article.id, title: "my new title" }
      article.reload
      article.title.should == 'my new title'
    end

    it "should allow the publication date to be changed" do
      post :update, { id: article.id, publication_date: "2014-3-3" }
      article.reload
      article.publication_date.should == Date.parse('2014-03-03')
    end

    it "should allow the authors to be changed" do
      post :update, {
        id: article.id,
        authors: [{
          first_name: 'Ben',
          middle_name: 'E.',
          last_name: 'Coe'
        }]
      }
      article.reload
      article.authors_denormalized.should include({
        first_name: 'Ben',
        middle_name: 'E.',
        last_name: 'Coe'
      })
    end

    it "should allow the abstract to be changed" do
      post :update, { id: article.id, abstract: "my wacky research" }
      article.reload
      article.abstract.should == 'my wacky research'
    end

    it "should raise a 401 if user tries to update article they did not create" do
      post :update, { id: article_2.id, abstract: "my wacky research" }
      response.status.should == 401
      article_2.reload
      article_2.title.should == 'awesome article'
    end
  end

  describe "#destroy" do
    it "allows an article created by current_user to be destroyed" do
      delete :destroy, { id: article.id }
      response.status.should == 200

      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 1
      results['total'].should == 1
    end

    it "does not allow current_user to destroy another user's article" do
      delete :destroy, { id: article_2.id }
      response.status.should == 401

      get :index
      results = JSON.parse(response.body)
      results['documents'].count.should == 2
      results['total'].should == 2
    end

    it "returns a 404 if article is not found" do
      delete :destroy, { id: -1 }
      response.status.should == 404
    end
  end
end
