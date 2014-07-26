require 'rails_helper'

describe Article do

  before(:all) { WebMock.disable! }
  after(:all) do
    reset_index
    WebMock.enable!
  end

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

  context "author" do
    describe "add_author" do
      it "adds an author to the authors_denormalized field" do
        article = Article.create(doi: '123banana', title: 'foo')
        article.add_author('Ben', 'Ernest', 'Coe').save!
        article.authors_denormalized.first[:first_name]
          .should == 'Ben'
        article.authors_denormalized.first[:middle_name]
          .should == 'Ernest'
        article.authors_denormalized.first[:last_name]
          .should == 'Coe'
      end
    end
  end

  context "indexing" do
    describe "create_mapping" do

      before(:all) { reset_index }

      it "creates articles mapping" do
        Article.put_mapping

        # Ensure that the mapping is created.
        mapping = ElasticMapper.index.get_mapping
          .curatescience_test
          .mappings
          .articles

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
      Article.put_mapping
      [a1, a2, a3] # force indexing.
      ElasticMapper.index.refresh
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
        abstract: 'a third article',
      ).tap do |a|
        a.add_author('Benjamin', 'E', 'Coe')
        a.add_author('Christian', 'J-Bone', 'Battista')
        a.save
      end
    end

    it "can perform full-text search within abstract" do
      articles = Article.search('hello')

      articles.documents.count.should == 1
      articles.documents.first.should == a1
    end

    it "can perform full-text search by author" do
      articles = Article.search('Christian')
      articles.documents.count.should == 1
      articles.documents.first.should == a3
    end

    context "sorting" do

      it "by default, sorts by score" do
        articles = Article.search('world')
        articles.documents.should == [a1, a2]
      end

      it "can sort by date" do
        articles = Article.search('*', sort: { publication_date: 'desc'})
        articles.documents.should == [a3, a2, a1]

        articles = Article.search('*', sort: { publication_date: 'asc'})
        articles.documents.should == [a1, a2, a3]
      end

      it "can sort by title" do
        articles = Article.search('*', sort: { title: 'desc'})
        articles.documents.should == [a1, a3, a2]

        articles = Article.search('*', sort: { title: 'asc'})
        articles.documents.should == [a2, a3, a1]
      end

    end

  end

  describe "studies" do
    let(:article) do
      Article.create(
        title: 'Z Article',
        doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
        publication_date: Time.now - 3.days,
        abstract: 'hello world'
      )
    end

    it "should allow a study to be created via an article" do
      study = article.studies.create
      article.reload

      # test that all relationships are created.
      article.studies.count.should == 1
      study.id.should == article.studies.first.id
      study.article_id.should == article.id
    end
  end

  describe "comments" do
    let(:article) do
      Article.create(
        title: 'Z Article',
        doi: 'http://dx.doi.org/10.6084/m9.figshare.949676',
        publication_date: Time.now - 3.days,
        abstract: 'hello world'
      )
    end

    it "allows you to add a comment to an article" do
      article.add_comment(0, "hello world!")
      article.reload
      article.comments.first.comment.should == 'hello world!'
    end

    it "should update comment_count when comments are created" do
      article.add_comment(0, "hello world!")
      article.reload
      article.add_comment(0, "hello world!")
      article.reload
      article.comment_count.should == 2
    end
  end

end
