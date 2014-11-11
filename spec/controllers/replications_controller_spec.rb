require 'rails_helper'

describe ReplicationsController, :type => :controller do
  # creating an article indexes
  # the article in ES which causes
  # problems for WebMock.
  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }
  before(:each) do
    controller.stub(:current_user).
      and_return(user)
  end

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
  let(:article) do
    Article.create(
      title: 'Z Article',
      doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
      publication_date: Time.now - 3.days,
      abstract: 'hello world'
    )
  end
  let(:study) do
    Study.create({ article_id: article.id })
  end
  let(:replicating_study_1) do
    Study.create({ article_id: article.id })
  end
  let(:replicating_study_2) do
    Study.create({ article_id: article.id })
  end
  let(:replicating_study_3) do
    Study.create({ article_id: article.id })
  end
  let!(:replication_1) do
    replication = Replication.create(
      study_id: study.id,
      replicating_study_id: replicating_study_1.id,
      closeness: 2,
      owner_id: user.id
    )
  end
  let!(:replication_2) do
    replication = Replication.create(
      study_id: study.id,
      replicating_study_id: replicating_study_2.id,
      closeness: 2,
      owner_id: user_2.id
    )
  end

  describe('#index') do
    it("returns a list of all replications for a study") do
      get :index, { study_id: study.id, article_id: article.id }
      results = JSON.parse(response.body)
      response.status.should == 200
      results.count.should == 2

      results.should include(JSON.parse(replication_1.as_json(replications: true, authors: true).to_json))
      results.should include(JSON.parse(replication_2.as_json(replications: true, authors: true).to_json))
    end

    it("returns a list of all replications for a study, if only the study_id is provided") do
      get :index, { study_id: study.id }
      results = JSON.parse(response.body)
      response.status.should == 200
      results.count.should == 2

      results.should include(JSON.parse(replication_1.as_json(replications: true, authors: true).to_json))
      results.should include(JSON.parse(replication_2.as_json(replications: true, authors: true).to_json))
    end

    it("returns a 404 if article_id not found") do
      get :index, { article_id: -1, study_id: study.id }
      results = JSON.parse(response.body)
      response.status.should == 404
    end
  end

  describe('#show') do
    it("should return a single replication") do
      get :show, { article_id: article.id, study_id: study.id, id: replication_1.id }
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(replication_1.as_json(replications: true, authors: true).to_json)
    end

    it("should return a single replication, if article_id is not provided") do
      get :show, { study_id: study.id, id: replication_1.id }
      response.status.should == 200
      JSON.parse(response.body).should == JSON.parse(replication_1.as_json(replications: true, authors: true).to_json)
    end

    it("returns a 404 if a required id is not found") do
      get :show, { article_id: -1, study_id: study.id, id: replication_1.id }
      response.status.should == 404
      get :show, { article_id: article.id, study_id: -1, id: replication_1.id }
      response.status.should == 404
      get :show, { article_id: article.id, study_id: study.id, id: -1 }
      response.status.should == 404
    end
  end

  describe("#create") do
    it("allows a new replication to be associated") do
      post :create, {
        article_id: article.id,
        study_id: study.id,
        replicating_study_id: replicating_study_3.id,
        closeness: 3
      }

      response.status.should == 201
      JSON.parse(response.body)['closeness'].should == 3
      study.replications.count.should == 3
    end

    it("creates a replication that is associated with the current logged in user") do
      post :create, {
        article_id: article.id,
        study_id: study.id,
        replicating_study_id: replicating_study_3.id,
        closeness: 3
      }
      response.status.should == 201
      owner = Replication.find(JSON.parse(response.body)['id']).owner
      owner.should == user
    end

    it("raises a 404 if ids are missing") do
      post :create, { article_id: -1, study_id: study.id, replicating_study_id: replication_1.id }
      response.status.should == 404
      post :create, { article_id: article.id, study_id: -1, replicating_study_id: replication_1.id }
      response.status.should == 404
      post :create, { article_id: article.id, study_id: -1, replicating_study_id: -1 }
      response.status.should == 404
    end
  end

  describe("#update") do
    it "allows the closeness of a replication to be updated" do
      post :update, {
        article_id: article.id,
        study_id: study.id,
        id: replication_2.id,
        closeness: 7
      }

      response.status.should == 200
      replication_2.reload
      replication_2.closeness.should == 7
    end

    it "allows the closeness of a replication to be updated w/o article id" do
      post :update, {
        study_id: study.id,
        id: replication_2.id,
        closeness: 8
      }

      response.status.should == 200
      replication_2.reload
      replication_2.closeness.should == 8
    end

    it "raises a 404 if ids are missing" do
      post :update, { article_id: article.id, study_id: -1, id: replication_1.id }
      response.status.should == 404
      post :update, { article_id: article.id, study_id: study.id, id: -1 }
      response.status.should == 404
    end

  end

  describe("#delete") do

    it("does not allow a replication to be deleted by someone other than the owner") do
      delete :destroy, { id: replication_2.id }
      response.status.should == 401
      Replication.all.count.should == 2
    end

    it("allows the owner of a replication to delete it") do
      delete :destroy, { id: replication_1.id }
      response.status.should == 204
      Replication.all.count.should == 1
      Replication.first.should == replication_2
    end

    it("allows a replication to be deleted if it has no owner") do
      replication_2.update(owner_id: nil)
      delete :destroy, { id: replication_2.id }
      response.status.should == 204
      Replication.all.count.should == 1
    end
  end

end
