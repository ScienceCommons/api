require 'rails_helper'

describe Author do

  before(:all) { WebMock.disable! }
  after(:all) do
    reset_index
    WebMock.enable!
  end

  context "first_name" do
    it "should not allow an author with a nil first_name to be created" do
      author = Author.create(last_name: 'dog')

      author.errors.count.should == 1

      field, error = author.errors.first
      field.should == :first_name
      error.should == "can't be blank"
    end
  end

  context "last_name" do
    it "should not allow an author with a nil last_name to be created" do
      author = Author.create(first_name: 'dog')

      author.errors.count.should == 1

      field, error = author.errors.first
      field.should == :last_name
      error.should == "can't be blank"
    end
  end

  context "indexing" do
    describe "create_mapping" do

      before(:all) { reset_index }

      it "creates author mapping" do
        Author.put_mapping

        # Ensure that the mapping is created.
        mapping = ElasticMapper.index.get_mapping
          .curatescience_test
          .mappings
          .authors

        mapping.should_not == nil

        # Make sure the correct properties
        # are set.
        pr = mapping.properties

        pr.first_name.type.should == 'string'
        pr.first_name[:index].should == 'not_analyzed'

        pr.middle_name.type.should == 'string'
        pr.middle_name[:index].should == 'not_analyzed'

        pr.last_name.type.should == 'string'
        pr.last_name[:index].should == 'not_analyzed'
      end
    end
  end

  context "searching" do
    before(:each) do
      reset_index
      Author.put_mapping
      [a1, a2, a3] # force indexing.
      ElasticMapper.index.refresh
    end
    let(:a1) do
      Author.create!(
        first_name: 'first1_name',
        last_name: 'last1_name'
      )
    end
    let(:a2) do
      Author.create!(
        first_name: 'first2_name',
        last_name: 'last2_name'
      )
    end
    let(:a3) do
      Author.create!(
        first_name: 'first3_name',
        last_name: 'last3_name'
      )
    end

    it "can search by last name" do
      authors = Author.search('last2_name')

      authors.documents.count.should == 1
      authors.documents.first.should == a2
    end

    context "sorting" do
      it "can sort by last name" do
        authors = Author.search('*', sort: { last_name: 'desc'})
        authors.documents.should == [a3, a2, a1]

        authors = Author.search('*', sort: { last_name: 'asc'})
        authors.documents.should == [a1, a2, a3]
      end
    end

  end
end
