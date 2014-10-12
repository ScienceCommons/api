require 'rails_helper'

describe Replication do

  # creating an article indexes
  # the article in ES which causes
  # problems for WebMock.
  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  let!(:owner) do
    User.create!({
      :email => "ben@example.com"
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
    Study.create({
        article_id: article.id,
        n: 0,
        power: 0
    })
  end
  let(:replicating_study) do
    Study.create({
        article_id: article.id,
        n: 0,
        power: 0
    })
  end

  describe "create" do
    it "should not allow replication to be created without a study" do
      replication = Replication.create(
        replicating_study_id: replicating_study.id,
        closeness: 2
      )

      replication.errors.count.should == 1
      field, error = replication.errors.first
      field.should == :study_id
      error.should == "can't be blank"
    end

    it "should not allow replication to be created without a replicating study" do
      replication = Replication.create(
        study_id: study.id,
        closeness: 2
      )

      replication.errors.count.should == 1
      field, error = replication.errors.first
      field.should == :replicating_study_id
      error.should == "can't be blank"
    end

    it "allows an owner to be specified when creating a replication" do
      replication = Replication.create(
        replicating_study_id: replicating_study.id,
        study_id: study.id,
        closeness: 2,
        owner_id: owner.id
      )
      replication.reload
      replication.owner.should == owner
    end

    it "should not allow the study and the replicating study to be the same" do
      replication = Replication.create(
        study_id: study.id,
        replicating_study_id: study.id,
        closeness: 2
      )

      replication.errors.count.should == 1
      field, error = replication.errors.first
      field.should == :replicating_study_id
      error.should == "must be different from study_id"
    end
  end

  describe "returning study objects" do
    let(:replication) do
      Replication.create(
        replicating_study_id: replicating_study.id,
        study_id: study.id,
        closeness: 2
      )
    end

    it "should return a study from a replication" do
      replication.study.should == study
    end

    it "should return a replicating study" do
      replication.replicating_study == study
    end
  end
end
