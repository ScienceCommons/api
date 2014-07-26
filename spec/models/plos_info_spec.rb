require 'rails_helper'

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
        article.authors_denormalized.should == [
          {
            first_name: 'Benoit',
            middle_name: nil,
            last_name: 'Bediou'
          },
          {
            first_name: 'Klaus',
            middle_name: 'R.',
            last_name: 'Scherer'
          }]
      end
    end
  end

end
