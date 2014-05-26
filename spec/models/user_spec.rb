require 'spec_helper'

describe User do

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.disable! }

  let(:user) do
    User.create!({
      :email => "ben@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end
  let(:user_2) do
    User.create!({
      :email => "bob@example.com",
      :password => "11111111",
      :password_confirmation => "11111111"
    })
  end

  describe "replications" do
    let!('replication_1') do
      Replication.create(
        replicating_study_id: 0,
        study_id: 1,
        closeness: 2,
        owner_id: user.id
      )
    end
    let!('replication_2') do
      Replication.create(
        replicating_study_id: 3,
        study_id: 1,
        closeness: 4,
        owner_id: user.id
      )
    end
    let!('replication_3') do
      Replication.create(
        replicating_study_id: 3,
        study_id: 1,
        closeness: 4,
        owner_id: user_2.id
      )
    end

    it "allows all replications created by a user to be looked up" do
      user.replications.count.should == 2
    end
  end

  describe "articles" do
    let!(:article) { Article.create(doi: '123banana', title: 'hello world', owner_id: user.id) }
    let!(:article_2) { Article.create(doi: '123apple', title: 'awesome man', owner_id: user.id) }
    let!(:article_3) { Article.create(doi: '123apple', title: 'awesome man', owner_id: user_2.id) }

    it "allows all articles created by a user to be looked up" do
      user.articles.count.should == 2
    end
  end

  describe "studies" do
    let!(:s1) { Study.create( article_id: 0, owner_id: user.id, n: 0, power: 0) }
    let!(:s2) { Study.create( article_id: 0, owner_id: user.id, n: 0, power: 0) }
    let!(:s3) { Study.create( article_id: 0, owner_id: user_2.id, n: 0, power: 0) }

    it "allows all studies created by a user to be looked up" do
      user.studies.count.should == 2
    end
  end
end
