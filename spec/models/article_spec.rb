require 'spec_helper'

describe Article do

  describe "doi" do
    it "should not allow two articles with the same DOI to be created" do
      Article.create(doi: '123banana', title: 'hello world')
      article = Article.create(doi: '123banana', title: 'hello world')

      article.errors.count.should == 1

      field, error = article.errors.first

      field.should == :doi
      error.should == 'has already been taken'
    end

    it "should not allow an article with a nil DOI to be created" do
      article = Article.create(doi: nil, title: 'hello world')

      article.errors.count.should == 1

      field, error = article.errors.first
      field.should == :doi
      error.should == "can't be blank"
    end
  end

  context "title" do
    it "should not allow an article with a nil title to be created" do
      article = Article.create(doi: '123banana', title: nil)

      article.errors.count.should == 1

      field, error = article.errors.first
      field.should == :title
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
    before(:each) do
      reset_index
      a1.index
      a2.index
      a3.index
      $index.refresh
    end
    let(:a1) do
      Article.create(
        title: 'Z Article',
        doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
        publication_date: Time.now - 3.days,
        abstract: 'hello world'
      )
    end
    let(:a2) do
      Article.create(
        title: 'A Article',
        doi: 'http://dx.doi.org/10.6084/m9.figshare.949672',
        publication_date: Time.now - 2.days,
        abstract: 'goodnight moon world'
      )
    end
    let(:a3) do
      Article.create(
        title: 'B Article',
        doi: 'http://dx.doi.org/10.6084/m9.figshare.949670',
        publication_date: Time.now - 1.days,
        abstract: 'a third article'
      )
    end

    it "can perform full-text search within abstract" do
      articles = Article.search('hello')
      
      articles.count.should == 1
      articles.first.should == a1
    end

    context "sorting" do

      it "by default, sorts by score" do
        articles = Article.search('world')
        articles == [a1, a2]
      end

      it "can sort by date" do
        articles = Article.search('*', sort: { publication_date: 'desc'})
        articles.should == [a3, a2, a1]

        articles = Article.search('*', sort: { publication_date: 'asc'})
        articles.should == [a1, a2, a3]
      end

      it "can sort by title" do
        articles = Article.search('*', sort: { title: 'desc'})
        articles.should == [a1, a3, a2]

        articles = Article.search('*', sort: { title: 'asc'})
        articles.should == [a2, a3, a1]
      end

    end

    context "pagination" do

    end

  end

end
