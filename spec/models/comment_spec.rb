require 'rails_helper'

describe Comment do
  let(:article) do
    Article.create(
      title: 'Z Article',
      doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
      publication_date: Time.now - 3.days,
      abstract: 'hello world'
    )
  end
  before(:all) { WebMock.disable! }
  after(:all) do
    reset_index
    WebMock.enable!
  end

  describe "create" do
    it "appropriate fields must be present" do
      comment = Comment.create
      comment.errors.count.should == 4
    end

    it "comment count should default to 0" do
      comment = Comment.create
      comment.comment_count.should == 0
    end
  end

  describe "comment" do
    it "allows comments to be created on comments" do
      comment = article.comments.create!(owner_id: 0, comment: 'hello world')
      comment.comments.create!(owner_id: 0, comment: 'i on a comment!')
      comment.reload
      comment.comments.count.should == 1
      comment.comment_count.should == 1
    end
  end
end
