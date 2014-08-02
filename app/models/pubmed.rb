class Pubmed

  attr_accessor :web_env, :article_count

  PER_PAGE = 200
  ESEARCH_URL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
  EFETCH_URL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

  def initialize(journal, year)
    @journal = journal
    @year = year
  end

  def load_meta
    xml = get_xml(esearch)

    @article_count = xml.css('Count').first.text.to_i
    @web_env = xml.css('WebEnv').text
  end

  def load_article
    xml = get_xml(efetch)
    p xml
    # Article PubModel="Print-Electronic"
    # <ELocationID EIdType="doi" ValidYN="Y">10.1126/science.1163732</ELocationID>
    # <Abstract> <AbstractText>
    #
    #<AuthorList CompleteYN="Y"> <Author ValidYN="Y"> <LastName>Bednarek</LastName> <ForeName>Pawel</ForeName> <Initials>P</Initials>
    # ArticleTitle
  end

  def efetch(page=0)
    "#{EFETCH_URL}?db=pubmed&retmode=xml&WebEnv=#{@web_env}&query_key=1&retstart=#{PER_PAGE * page}&retmax=#{PER_PAGE}&#{ENV['PUBMED_KEY']}&tool=#{ENV['PUBMED_SECRET']}"
  end

  def esearch
    "#{ESEARCH_URL}?db=pubmed&term=#{CGI::escape(@journal)}[journal]+#{CGI::escape(@year)}[pdat]&usehistory=y&retmax=#{PER_PAGE}&email=#{ENV['PUBMED_KEY']}&tool=#{ENV['PUBMED_SECRET']}"
  end

  def get_xml(url)
    @xml ||= Nokogiri::XML(
      open(url)
    )
  end

end
