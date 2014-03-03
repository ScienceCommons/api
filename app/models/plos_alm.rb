# Pulls Article Level Metrics using PLOS ALM's API.
class PlosAlm
  attr_accessor :total_pages, :article_count

  PLOS_ALM_URL = 'http://alm.plos.org'
  ARTICLE_ACTION = '/api/v5/articles'

  def initialize(page = 1)
    @page = page # page to load.
    @response = nil # API response.
  end

  # update ALM information on each article.
  # if necessary, creates the article.
  def update_articles
    load_page.data.each do |article_struct|
      if Article.exists?(doi: article_struct['doi'])
        # This is where we would start to populate
        # article level metrics from PLOS ALM, as of
        # right now we are only using PLOS ALM to
        # seed DOIs.
      else
        # We've never seen an article with this DOI.
        create_article(article_struct)
      end
    end
  end

  # Create an article, enqueue jobs that
  # update the article's initial data, e.g., abstract.
  def create_article(article_struct)
    article = Article.create({
      publication_date: Date.parse(article_struct['publication_date']),
      doi: article_struct['doi'],
      title: article_struct['title']
    })

    # Enqueue a job to update article with abstract, author,
    # and other information.
    Resque.enqueue(Workers::PlosInfoWorker, article_struct['doi'])
  end
  private :create_article

  # Load pagination information for
  # article level metrics.
  def load_meta
    page = load_page
    self.total_pages = page.total_pages
    self.article_count = page.total
  end

  # Returns a page of articles and their metrics.
  def load_page
    @response ||= Faraday.new(:url => PLOS_ALM_URL).
      get(ARTICLE_ACTION, { api_key: ENV['PLOS_API_KEY'], page: @page })

    raise 'http error' unless @response.status == 200

    OpenStruct.new( JSON.parse(@response.body) )
  end

  # enqueues workers to update metric data
  # for each page returned by the PLOS ALM API.
  def enqueue_plos_alm_update_workers
    load_meta
    (1..total_pages).each_with_index do |index|
      Resque.enqueue(Workers::PlosAlmWorker, index)
    end
  end

end
