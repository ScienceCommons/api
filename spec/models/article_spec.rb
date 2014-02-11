require 'spec_helper'

describe Article do
  it "should not allow two articles with the same DOI to be created" do
    Article.create(doi: '123banana')
    expect { Article.create(doi: '123banana') }.to raise_error(ActiveRecord::RecordNotUnique)
  end
end
