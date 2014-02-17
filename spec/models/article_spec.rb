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

  context "indexing" do
    describe "create_mapping" do

      before(:all) { reset_index }

      it "creates articles mapping" do
        Article.create_mapping
        $index.refresh

        # Ensure that the mapping is created.
        mapping = $index.get_mapping.
          papersearch_test.articles

        mapping.should_not == nil

        # Make sure the correct properties
        # are set.
        pr = mapping.properties

        pr.doi.type.should == 'string'
        pr.doi[:index].should == 'not_analyzed'
        pr.publication_date.type.should == 'date'
        pr.abstract.type == 'string'
        pr.abstract[:index] == 'analyzed'
      end
    end
  end

  context "searching" do
    before(:all) { reset_index }
    let(:article) do
      Article.create(
        doi: '123banana',
        publication_date: Time.now,
        abstract: 'Hello World!'
      )
    end

    it "can perform full-text search within abstract" do
      article.index
      $index.refresh
      article.search('Hello')
    end
  end

end
