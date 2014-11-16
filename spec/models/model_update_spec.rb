require 'rails_helper'

describe ModelUpdate do
  before(:all) { WebMock.disable! }
  after(:all) do
    reset_index
    WebMock.enable!
  end

  let(:user) { User.create!({ :email => "ben@example.com" }) }
  let(:article) { Article.create!(doi: '123banana', title: 'hello world', owner_id: user.id, updated_at: '2006-03-05') }

  it "marks the model update as approved" do
    article.model_updates.create!(:submitter => user, :model_changes => {"title" => ["cat", "dog"]}, :operation => :model_updated)
    article.model_updates.first.approved.should be_truthy
  end

end
