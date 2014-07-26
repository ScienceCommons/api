require 'rails_helper'

describe Workers::PlosAlmWorker do
  before(:all) { Resque.inline = true }
  after(:all) { Resque.inline = false }

  it "executes a PLOS ALM update for the page of articles" do
    PlosAlm.any_instance.should_receive(:update_articles)
    Resque.enqueue(Workers::PlosAlmWorker, 1)
  end

end
