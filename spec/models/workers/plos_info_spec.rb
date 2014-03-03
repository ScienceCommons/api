require 'spec_helper'

describe Workers::PlosInfoWorker do
  before(:all) { Resque.inline = true }
  after(:all) { Resque.inline = false }

  it "executes a plos info lookup, for the given doi" do
    PlosInfo.any_instance.should_receive(:update)
    Resque.enqueue(Workers::PlosInfoWorker, 1)
  end

end
