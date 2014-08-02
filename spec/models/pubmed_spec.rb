require 'spec_helper'

describe Pubmed do

  before(:each) do
    Resque.stub(:enqueue)
    Article.any_instance.stub(:index)
  end

  describe "load_meta" do
    it "loads pagination information" do
      VCR.use_cassette('pubmed') do
        pubmed = Pubmed.new(
          "science",
          "2008"
        )
        pubmed.load_meta

        pubmed.web_env.should == 'NCID_1_1139840066_130.14.22.215_9001_1407009159_300368070_0MetA0_S_MegaStore_F_1'
        pubmed.article_count.should == 2250
      end
    end
  end

  describe "crawl" do
    it "should enqueue a job for each page of articles" do
      VCR.use_cassette('pubmed') do
        pubmed = Pubmed.new(
          "science",
          "2008"
        )
        expect(Resque).to receive(:enqueue).exactly(12).times
        pubmed.crawl
      end
    end
  end

  describe "create_articles" do
    let(:article) { Article.find_by_doi('10.1126/science.1163233') }
    before(:each) do
      VCR.use_cassette('pubmed_articles') do
        pubmed = Pubmed.new(
          "science",
          "2008"
        )
        pubmed.load_meta
        pubmed.create_articles
      end
    end

    it "should create articles for each doi, if they do not exist" do
      article.title.should == 'Ab initio determination of light hadron masses.'
    end

    it "should populate an abstract for each article" do
      article.abstract.should match(/More than 99% of the mass of the visible/)
    end

    it "should populate an journal title and issn" do
      article.journal_title.should == 'Science (New York, N.Y.)'
      article.journal_issn.should == '1095-9203'
    end

    it "should populate authors for each article" do
      article.authors_denormalized.should include({
        first_name: 'S',
        middle_name: nil,
        last_name: 'Dürr'
      })

      article.authors_denormalized.should include({
        first_name: 'G',
        middle_name: nil,
        last_name: 'Vulvert'
      })
    end
  end

end
