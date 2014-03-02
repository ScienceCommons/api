require 'spec_helper'

describe PlosAlm do

  describe "load_meta" do
    
    describe "loads pagination information" do
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new.tap do |p|
          p.load_meta
        end

        plos_alm.total_pages.should == 2266
        plos_alm.article_count.should == 113299
      end
    end

  end

end
