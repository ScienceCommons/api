class PlosAlm
  attr_accessor :total_pages, :article_count

  PLOS_ALM_URL = 'http://alm.plos.org'
  ARTICLE_ACTION = '/api/v5/articles'

  # Load pagination information for
  # article level metrics.
  def load_meta
    page = load_page
    self.total_pages = page.total_pages
    self.article_count = page.total
  end

  # Returns a page of articles and their
  # metric information.
  def load_page(page = 1)
    r = Faraday.new(:url => PLOS_ALM_URL).
      get(ARTICLE_ACTION, { api_key: ENV['PLOS_API_KEY'], page: page })

    raise 'http error' unless r.status == 200

    OpenStruct.new( JSON.parse(r.body) )
  end
end
