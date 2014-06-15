require 'spec_helper'

describe StudiesController do

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
  let!(:article) { Article.create(doi: '123banana', title: 'hello world') }
  let!(:article_no_studies) { Article.create(doi: '1234banana', title: 'hello world') }

  let!(:s1) do
    article.studies.create.tap do |s|
      s.add_independent_variables('health')
      s.add_dependent_variables('happiness')
      s.set_effect_size(:r, 0.5)
      s.owner_id = user.id
      s.save!
    end
  end
  let!(:s2) { article.studies.create({ owner_id: user_2.id }) }
  let!(:s3) { article.studies.create() }
  let(:time_in_past) { 1400463719 }

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }
  before(:each) do
    controller.stub(:current_user).
      and_return(user)
  end

  describe "#index" do
    it "should return all studies for a given article" do
      get :index, article_id: article.id
      response.status.should == 200
      studies = JSON.parse(response.body)
      studies.count.should == 3
      studies.should include(JSON.parse(s1.to_json))
      studies.should include(JSON.parse(s2.to_json))
    end

    it "should return an empty array if no studies exist" do
      get :index, article_id: article_no_studies.id
      studies = JSON.parse(response.body)
      response.status.should == 200
      studies.count.should == 0
      studies.kind_of?(Array).should == true
    end

    it "should raise a 404 if an article is not found" do
      get :index, article_id: 'banana'
      response.status.should == 404
    end

    it "should raise a 500 if no article_id is provided" do
      get :index
      response.status.should == 500
    end
  end

  describe "#show" do
    it "should return a specific study" do
      get :show, article_id: article.id, id: s2.id
      response.status.should == 200
      JSON.parse(response.body)['id'].should == s2.id
    end

    it "should return a specific study, given only a study_id" do
      get :show, id: s2.id
      response.status.should == 200
      JSON.parse(response.body)['id'].should == s2.id
    end

    it "should return created_at as an integer epoch" do
      get :show, article_id: article.id, id: s2.id
      study = JSON.parse(response.body)
      study['created_at'].should > time_in_past
    end

    it "should return updated_at as an integer epoch" do
      get :show, article_id: article.id, id: s2.id
      study = JSON.parse(response.body)
      study['updated_at'].should > time_in_past
    end
  end

  describe "#create" do
    it "should allow a new blank study to be created" do
      post :create, {article_id: article.id}

      response.status.should == 201
      study = JSON.parse(response.body)
      article.reload
      article.studies.count.should == 4
      study['power'].should == nil
      study['n'].should == nil
    end

    it "should allow us to populate power and n" do
      post :create, {
        article_id: article.id,
        n: 22,
        power: 0.5
      }

      response.status.should == 201
      study = JSON.parse(response.body)
      study['n'].should == 22
      study['power'].should == 0.5
    end

    it "allows dependent variables to be added when creating study" do
      post :create, {
        article_id: article.id,
        dependent_variables: [
          'apple',
          'self-actualization'
        ]
      }

      response.status.should == 201
      study = JSON.parse(response.body)
      study['dependent_variables'].count == 2
      study['dependent_variables'].should include('self-actualization')
    end

    it "allows independent variables to be added when creating study" do
      post :create, {
        article_id: article.id,
        independent_variables: [
          'banana',
          'inclusive-working-environment'
        ]
      }

      response.status.should == 201
      study = JSON.parse(response.body)
      study['independent_variables'].count == 2
      study['independent_variables'].should include('inclusive-working-environment')
    end

    it "allows effect_size to be set when creating a study" do
      post :create, {
        article_id: article.id,
        effect_size: {'r' => 0.3}
      }

      response.status.should == 201
      study = JSON.parse(response.body)
      study['effect_size']['r'].should == 0.3
    end

    it "should raise a 500 if effect size is not valid" do
      post :create, {
        article_id: article.id,
        effect_size: {q: 0.9}
      }

      response.status.should == 500
      JSON.parse(response.body)['error'].should == 'q is not a valid effect size.'
    end
  end

  describe '#update' do
    it "should update simple keys on study" do
      post :update, {
        article_id: article.id,
        id: s2.id,
        n: 25,
        power: 0.1
      }

      response.status.should == 200
      s2.reload
      s2.n.should == 25
      s2.power.should == 0.1
    end

    it "should update simple keys on study even without article id" do
      post :update, {
        id: s2.id,
        n: 35,
        power: 99
      }

      response.status.should == 200
      s2.reload
      s2.n.should == 35
      s2.power.should == 99
    end

    it "should raise a 500 if effect size is not valid" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        effect_size: {q: 0.9}
      }

      response.status.should == 500
      JSON.parse(response.body)['error'].should == 'q is not a valid effect size.'
    end

    it "should update dependent and independent variables" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana'],
        independent_variables: ['apple']
      }

      response.status.should == 200
      s1.reload
      s1.independent_variables.first.should == 'apple'
      s1.dependent_variables.first.should == 'banana'
    end

    it "should allow effect size to be updated" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana'],
        effect_size: {d: 0.9}
      }

      response.status.should == 200
      s1.reload
      s1.dependent_variables.first.should == 'banana'
      s1.effect_size.should == {d: 0.9}
    end
  end

  describe "#destroy" do
    it "allows a user to delete a study that they create" do
      delete :destroy, {
        article_id: article.id,
        id: s1.id
      }
      response.status.should == 204
      Study.all.count.should == 2
    end

    it "allows a user to delete a study that has no owner" do
      delete :destroy, {
        article_id: article.id,
        id: s3.id
      }
      response.status.should == 204
      Study.all.count.should == 2
    end

    it "should not allow you to delete a study that you did not create" do
      delete :destroy, {
        article_id: article.id,
        id: s2.id
      }
      response.status.should == 401
      Study.all.count.should == 3
    end
  end
end
