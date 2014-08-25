require 'rails_helper'

describe User do

  before(:all) { WebMock.disable! }
  after(:all) { WebMock.disable! }

  let(:user) do
    User.create!({
      :email => "ben@example.com"
    })
  end
  let(:user_2) do
    User.create!({
      :invite_count => 1,
      :email => "bob@example.com"
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

  describe "findings" do
    let!(:s1) { Study.create( article_id: 0, owner_id: user.id, n: 0, power: 0) }
    let!(:f1) { s1.findings.create(url: 'www.example.com', name: 'finding.txt', owner_id: user.id) }
    let!(:f2) { s1.findings.create(url: 'www.example2.com', name: 'finding2.txt', owner_id: user.id) }
    let!(:f3) { s1.findings.create(url: 'www.example3.com', name: 'finding3.txt', owner_id: user_2.id) }

    it "allows all findings created by a user to be looked up" do
      user.findings.count.should == 2
    end
  end

  describe "send_invite" do
    it "does not allow a user to send invites if invite_count is 0" do
      Invite.any_instance.should_not_receive(:send_invite)
      expect { user.send_invite('ben@example.com') }
        .to raise_error(Exceptions::NoInvitesAvailable)
    end

    it "allows an invite to be sent if invite_cout > 0" do
      Invite.any_instance.should_receive(:send_invite)
      user_2.invite_count.should == 1
      user_2.send_invite('ben@example.com')
      user_2.invite_count.should == 0
    end
  end

end
