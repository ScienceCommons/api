require 'spec_helper'

describe Workers::PlosAlmUpdateWorker do
  before(:all) { Resque.inline = true }
  after(:all) { Resque.inline = false }

  it "executes a PLOS ALM update for the page of articles" do
    VCR.use_cassette('plos_alm') do
      PlosAlm.any_instance.should_receive(:update_articles)
      Resque.enqueue(Workers::PlosAlmUpdateWorker, 1)
    end
  end

end
