require 'rails_helper'

describe BetaController, :type => :controller do
  let(:article) { Article.create!(doi: '123banana', title: 'hello world', updated_at: '2006-03-05') }
  let(:article_2) { Article.create!(doi: '123apple', title: 'awesome article', updated_at: '2007-03-05') }
  let(:article_3) { Article.create!(doi: '123mango', title: 'article 3', updated_at: '2008-03-05') }

  let(:author) {
    author = Author.create!({first_name: 'cat', last_name: 'dog'})
    author.articles << article
    author.articles << article_2
    author.save
    author
  }

  let(:author_2) { Author.create!({first_name: 'rabbit', last_name: 'hamster'}) }
  let(:author_3) { Author.create!({first_name: 'horse', last_name: 'cow123'}) }

  before(:all) do
    WebMock.disable!
    Timecop.freeze(Time.local(1990))
  end
  after(:all) do
    WebMock.enable!
    Timecop.return
  end

  before(:each) do
    # reset ES index, and make sure
    # testing articles are indexed.
    reset_index
    Article.put_mapping
    Author.put_mapping
    [article, article_2, article_3, author, author_2, author_3]
    ElasticMapper.index.refresh
  end

  describe '#search' do
    it 'should return articles and authors' do
      get :search
      results = JSON.parse(response.body)
      results['documents'].count.should == 6
      results['total'].should == 6
    end

    it 'should find an author' do
      get :search, :q => 'rabbit'
      results = JSON.parse(response.body)
      results['documents'].count.should == 1
      author = results['documents'].first
      author['last_name'].should == 'hamster'
    end

    it 'should find authors and articles' do
      get :search, :q => '*123*'
      results = JSON.parse(response.body)
      results['documents'].count.should == 4
      article = results['documents'].first
      article['type'].should == 'Article'
      article['doi'].should == '123banana'
      author = results['documents'].last
      author['type'].should == 'Author'
      author['first_name'].should == 'horse'
      author['last_name'].should == 'cow123'
    end
  end
end
