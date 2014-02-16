require 'spec_helper'

describe Article do

  describe "doi" do
    it "should not allow two articles with the same DOI to be created" do
      Article.create(doi: '123banana')
      article = Article.create(doi: '123banana')

      article.errors.count.should == 1

      field, error = article.errors.first

      field.should == :doi
      error.should == 'has already been taken'
    end

    it "should not allow an article with a nil DOI to be created" do
      article = Article.create(doi: nil)

      article.errors.count.should == 1

      field, error = article.errors.first
      field.should == :doi
      error.should == "can't be blank"
    end
  end

end
