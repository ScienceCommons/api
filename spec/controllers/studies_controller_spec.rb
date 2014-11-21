require 'rails_helper'

describe StudiesController, :type => :controller do

  let(:user) { User.create!({ :email => "ben@example.com", :curator => true }) }
  let(:user_2) { User.create!({ :email => "christian@example.com", :curator => false }) }
  let!(:article) { Article.create!(doi: '123banana', title: 'hello world') }
  let!(:article_no_studies) { Article.create!(doi: '1234banana', title: 'hello world') }

  let!(:s1) do
    article.studies.create!.tap do |s|
      s.add_independent_variables('health')
      s.add_dependent_variables('happiness')
      s.set_effect_size('r', 0.5)
      s.owner_id = user.id
      s.links << Link.new({name: "cat", url: "dog", type: "test"})
      s.links << Link.new({name: "bat", url: "happy", type: "test"})
      s.save!
    end
  end
  let!(:s2) { article.studies.create!({ owner_id: user_2.id }) }
  let!(:s3) { article.studies.create!() }
  let(:time_in_past) { 1400463719 }

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }
  before(:each) do
    controller.stub(:current_user).and_return(user)
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
      study['number'].should == ""
    end

    it "should allow us to populate power, n and number" do
      post :create, {
        article_id: article.id,
        n: 22,
        power: 0.5,
        number: "1a"
      }

      response.status.should == 201
      study = JSON.parse(response.body)
      study['n'].should == 22
      study['power'].should == 0.5
      study['number'].should == "1a"
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
      study['independent_variables'].count.should == 2
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

    it "should create links" do
      post :create, {article_id: article.id, links: [{name: "foo", url: "foobar", type: "test"}]}

      response.status.should == 201
      study = JSON.parse(response.body)
      article.reload
      article.studies.count.should == 4
      study['power'].should == nil
      study['n'].should == nil
      study['number'].should == ""
      study['links'].count.should == 1
      article.studies.find(study["id"]).links.count.should == 1
    end

    it "should log changes to model_updates" do
      post :create, { article_id: article.id, effect_size: {'r' => 0.3} }
      response.status.should == 201
      study_json = JSON.parse(response.body)
      study = Study.find(study_json['id'])
      study.model_updates.count.should == 1
      study.model_updates.first.operation.should == "model_created"
    end
  end

  describe '#update' do
    it "should update simple keys on study" do
      post :update, {
        article_id: article.id,
        id: s2.id,
        n: 25,
        power: 0.1,
        number: "2b"
      }

      response.status.should == 200
      s2.reload
      s2.n.should == 25
      s2.power.should == 0.1
      s2.number.should == "2b"
    end

    it "should update simple keys on study even without article id" do
      post :update, {
        id: s2.id,
        n: 35,
        power: 0.99
      }

      response.status.should == 200
      s2.reload
      s2.n.should == 35
      s2.power.should == 0.99
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

    it "should allow effect size to be cleared" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        effect_size: {}
      }

      response.status.should == 200
      s1.reload
      s1.effect_size.should be_empty
    end

    it "should update dependent and independent variables" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana', 'foo'],
        independent_variables: ['apple', 'cat']
      }

      response.status.should == 200
      s1.reload
      s1.independent_variables.count.should == 2
      s1.independent_variables.first.should == 'apple'
      s1.dependent_variables.count.should == 2
      s1.dependent_variables.first.should == 'banana'
    end

    it "should allow effect size to be updated" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana'],
        effect_size: {'d' => 0.9}
      }

      response.status.should == 200
      s1.reload
      s1.dependent_variables.first.should == 'banana'
      s1.effect_size.should == {'d' => 0.9}
    end

    it "should reset links" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana'],
        effect_size: {'d' => 0.9},
        links: [{name: "foo", url: "foobar", type: "test"}]
      }

      response.status.should == 200
      s1.reload
      s1.links.count.should == 1
    end

    it "should update existing links" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        links: [{id: s1.links.first.id, name: "foo", url: "foobar", type: "test"}]
      }

      response.status.should == 200
      res = JSON.parse(response.body)
      res["links"].count.should == 1
      res["links"].first["name"].should == "foo"

      s1.reload
      s1.links.count.should == 1
      s1.links.first.name.should == "foo"
      s1.links.first.url.should == "foobar"
    end

    it "should delete existing links" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        links: nil # testing case http://stackoverflow.com/questions/14647731/rails-converts-empty-arrays-into-nils-in-params-of-the-request
      }

      response.status.should == 200
      res = JSON.parse(response.body)
      res["links"].count.should == 0

      s1.reload
      s1.links.count.should == 0
    end

    it "should not delete existing links if the parameter is not passed" do
      post :update, {
        article_id: article.id,
        id: s1.id
      }

      response.status.should == 200
      res = JSON.parse(response.body)
      res["links"].count.should == 2

      s1.reload
      s1.links.count.should == 2
    end

    it "should log changes to model_updates" do
      post :update, {
        article_id: article.id,
        id: s1.id,
        dependent_variables: ['banana'],
        effect_size: {'d' => 0.9},
        links: [{id: s1.links.first.id, name: "foo", url: "foobar", type: "test"}]
      }
      s1.reload
      s1.model_updates.count.should == 1
      s1.model_updates.first.operation.should == "model_updated"
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

    it "allows a curator to delete a study that they did not create" do
      delete :destroy, {
        article_id: article.id,
        id: s2.id
      }
      response.status.should == 204
      Study.all.count.should == 2
    end

    it "should not allow a non-curator to delete a study" do
      controller.stub(:current_user).and_return(user_2)
      delete :destroy, {
        article_id: article.id,
        id: s2.id
      }
      response.status.should == 401
      Study.all.count.should == 3
    end
  end
end
