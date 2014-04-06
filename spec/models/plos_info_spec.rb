require 'spec_helper'

describe PlosInfo do

  before(:each) { Article.any_instance.stub(:index) }

  describe "xml" do
    it "retrieves xml for article based on DOI"  do
      VCR.use_cassette('plos_info') do
        doi = '10.1371/journal.pone.0088432'
        xml = PlosInfo.new(doi).get_xml

        xml.css('article-id[pub-id-type=doi]').first.
          text.should == doi
      end
    end
  end

  describe "info" do
    it "extracts appropriate fields from xml" do
      VCR.use_cassette('plos_info') do
        info = PlosInfo.new('10.1371/journal.pone.0088432').info

        info[:abstract].should =~ /egocentric biases/
      end
    end
  end

  describe "update" do
    it "updates article with fields extracted from XML" do
      VCR.use_cassette('plos_info') do
        article = Article.create(
          doi: '10.1371/journal.pone.0088432',
          title: 'Egocentric Fairness Perception'
        )

        PlosInfo.new('10.1371/journal.pone.0088432').update
        article.reload
        article.abstract.should =~ /egocentric biases/
      end
    end
  end

end
