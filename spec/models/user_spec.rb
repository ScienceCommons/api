require 'spec_helper'

describe User do

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
end
