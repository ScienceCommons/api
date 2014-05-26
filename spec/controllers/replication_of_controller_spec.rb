require 'spec_helper'

describe ReplicationOfController do
  # creating an article indexes
  # the article in ES which causes
  # problems for WebMock.
  before(:all) { WebMock.disable! }
  after(:all) { WebMock.enable! }

  let(:article) do
    Article.create(
      title: 'Z Article',
      doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
      publication_date: Time.now - 3.days,
      abstract: 'hello world'
    )
  end
  let(:study) do
    Study.create({ article_id: article.id, n: 0, power: 0 })
  end
  let(:replicating_study_1) do
    Study.create({ article_id: article.id, n: 0, power: 0 })
  end
  let(:replicating_study_2) do
    Study.create({ article_id: article.id, n: 0, power: 0 })
  end
  let!(:replication_1) do
    replication = Replication.create(
      study_id: study.id,
      replicating_study_id: replicating_study_1.id,
      closeness: 2
    )
  end
  let!(:replication_2) do
    replication = Replication.create(
      study_id: study.id,
      replicating_study_id: replicating_study_2.id,
      closeness: 2
    )
  end

  describe('#index') do
    it("returns a list of all replications for a study") do
    end

    it("raises a 404 if ids are missing") do
    end
  end

  describe('#show') do
    it("should return a single replication_of") do
    end

    it("returns a 404 if a required id is not found") do
    end
  end

end
