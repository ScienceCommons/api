require 'rails_helper'

describe ReplicationOfController, :type => :controller do
  let(:user) { User.create!({ :email => "ben@example.com", :curator => true }) }
  let(:article) do
    Article.create!(
      title: 'Z Article',
      doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
      publication_date: Time.now - 3.days,
      abstract: 'hello world'
    )
  end
  let(:study) { Study.create!({ article_id: article.id }) }
  let(:replicating_study_1) { Study.create!({ article_id: article.id }) }
  let(:replicating_study_2) { Study.create!({ article_id: article.id }) }
  let!(:replication_1) do
    Replication.create!(
      study_id: study.id,
      replicating_study_id: replicating_study_1.id,
      closeness: 2
    )
  end
  let!(:replication_2) do
    Replication.create!(
      study_id: study.id,
      replicating_study_id: replicating_study_2.id,
      closeness: 2
    )
  end

  before(:all) do
    WebMock.disable!
  end
  after(:all) do
    WebMock.enable!
  end
  before(:each) do
    controller.stub(:current_user).and_return(user)
  end

  describe('#index') do
    it("returns a list of the studies that a study is a replication of") do
      get :index, { article_id: article.id, study_id: replicating_study_1.id }
      response.status.should == 200
      result = JSON.parse(response.body)
      replication_1.reload
      result.first.should == JSON.parse(replication_1.as_json(replication_of: true).to_json)
    end

    it("returns a list of studies that the study is a replication of given only a study id") do
      get :index, { study_id: replicating_study_1.id}
      response.status.should == 200
      result = JSON.parse(response.body)
      replication_1.reload
      result.first.should == JSON.parse(replication_1.as_json(replication_of: true).to_json)
    end


    it("raises a 404 if ids are missing") do
      get :index, { article_id: article.id, study_id: -1 }
      response.status.should == 404
    end
  end

  describe('#show') do
    it("should return a single replication_of") do
      get :show, { article_id: article.id, study_id: replicating_study_1.id, id: replication_1.id }
      response.status.should == 200
      result = JSON.parse(response.body)
      replication_1.reload
      result.should == JSON.parse(replication_1.as_json(replication_of: true).to_json)
    end

    it("should return a single replication_of with just a study and rep id") do
      get :show, { study_id: replicating_study_1.id, id: replication_1.id }
      response.status.should == 200
      result = JSON.parse(response.body)
      replication_1.reload
      result.should == JSON.parse(replication_1.as_json(replication_of: true).to_json)
    end


    it("returns a 404 if a required id is not found") do
      get :show, { article_id: article.id, study_id: -1, id: replication_1.id }
      response.status.should == 404
      get :show, { article_id: article.id, study_id: study.id, id: -1}
      response.status.should == 404
    end
  end

end
