require 'spec_helper'

describe PlosAlm do

  before(:each) do
    Resque.stub(:enqueue)
    Article.any_instance.stub(:index)
  end

  describe "load_meta" do
    describe "loads pagination information" do
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new
        plos_alm.load_meta

        plos_alm.total_pages.should == 2391
        plos_alm.article_count.should == 119531
      end
    end
  end

  describe "update_articles" do
    it "should create articles for each doi, if they do not exist" do
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.

        # all 50 articles are new, should create them.
        expect(Article).to receive(:create).exactly(50).times

        plos_alm.update_articles
      end
    end

    it "should enqueue a plos info worker for each article created" do
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.

        # all 50 articles are new, should create them.
        expect(Resque).to receive(:enqueue).exactly(50).times

        plos_alm.update_articles
      end
    end

    it "should not create an article if the doi already exists" do
      VCR.use_cassette('plos_alm') do
        # Create an article with a DOI that will be returned by plos alm.
        Article.create(doi: '10.1371/journal.pone.0094113', title: 'Fake Title')

        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.

        # We should not attempt to recreate 10.1371/journal.pone.0090521
        expect(Article).to receive(:create).exactly(49).times

        plos_alm.update_articles
      end
    end

    it "should create an article with the appropriate fields" do
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.
        plos_alm.update_articles # create all 50 articles.
        Article.find_by_doi('10.1371/journal.pone.0094113').destroy # destroy one article.

        expect(Article).to receive(:create).
          with({
            title: "Correction: Visualisation of Respiratory Tumour Motion and Co-Moving Isodose Lines in the Context of Respiratory Gating, IMRT and Flattening-Filter-Free Beams",
            publication_date: Date.parse('2014-03-28'),
            doi: '10.1371/journal.pone.0094113'
          })

        plos_alm.update_articles # we should recreate the one article we destroyed.
      end
    end
  end

  describe "enqueue_plos_alm_update_workers" do
    it "should enqueue an alm update worker for each page" do
      #  Resque.enqueue(Job, params)
      VCR.use_cassette('plos_alm') do
        plos_alm = PlosAlm.new(1) # Lookup first page of ALM data.
        expect(Resque).to receive(:enqueue).
          exactly(2391).times.
          with(Workers::PlosAlmWorker, anything)

        plos_alm.enqueue_plos_alm_update_workers
      end

    end
  end

end
