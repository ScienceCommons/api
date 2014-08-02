require 'spec_helper'

describe Pubmed do

  before(:each) do
    Resque.stub(:enqueue)
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

  describe "load_article" do
    it "should create articles for each doi, if they do not exist" do
      VCR.use_cassette('pubmed_articles') do
        pubmed = Pubmed.new(
          "science",
          "2008"
        )
        pubmed.load_meta
        pubmed.load_article


        pubmed.web_env.should == 'NCID_1_1058260831_130.14.18.34_9001_1407009331_826881071_0MetA0_S_MegaStore_F_1'
        pubmed.article_count.should == 2250
      end

=begin
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.

        # all 50 articles are new, should create them.
        expect(Article).to receive(:create).exactly(50).times

        plos_alm.update_articles
      end
=end
    end
  end

end
