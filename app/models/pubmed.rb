class Pubmed

  attr_accessor :web_env, :article_count

  PER_PAGE = 200
  ESEARCH_URL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
  EFETCH_URL = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

  def initialize(journal, year, page=0, web_env=nil)
    @page = page
    @journal = journal
    @year = year
    @web_env = web_env
  end

  def crawl
    load_meta # first load the meta information.

    # then create a job for each page of results.
    (0..@article_count).step(PER_PAGE) do |n|
      Resque.enqueue(Workers::PubmedWorker, @journal, @year, n / PER_PAGE, @web_env)
    end
  end

  def load_meta
    xml = get_xml(esearch)

    @article_count = xml.css('Count').first.text.to_i
    @web_env = xml.css('WebEnv').text
  end

  def create_articles
    xml = get_xml(efetch)

    xml.css('Article').each do |article_xml|
      doi = article_xml.css('ELocationID[EIdType="doi"]').text
      if !doi.empty? && !article_xml.css('PubDate').text.empty? && !Article.exists?(doi: doi)
        begin

          # Year Month Day or,
          # <MedlineDate>2012 Nov-Dec</MedlineDate>
          pub_date = if article_xml.css('PubDate MedlineDate').text.empty?
            DateTime.new(
              article_xml.css('PubDate Year').text.to_i,
              Date::ABBR_MONTHNAMES.index(article_xml.css('PubDate Month').text.empty? ? 'Jan' : article_xml.css('PubDate Month').text),
              article_xml.css('PubDate Day').text.empty? ? 1 : article_xml.css('PubDate Day').text.to_i
            )
          else
            split_date = article_xml.css('PubDate MedlineDate').text.split(' ')
            Date.new(
              split_date[0].to_i,
              Date::ABBR_MONTHNAMES.index(split_date[1].split('-')[0]),
              1
            )
          end

          article = Article.create!({
            journal_issn: article_xml.css('Journal ISSN').text,
            journal_title: article_xml.css('Journal Title').text,
            title: article_xml.css('ArticleTitle').text.strip,
            doi: doi,
            publication_date: pub_date,
            abstract: article_xml.css('AbstractText').text
          })

          article_xml.css('AuthorList Author').each do |author|
            article.add_author(
              author.css('ForeName').text,
              nil,
              author.css('LastName').text
            )
          end

          article.save!
        rescue StandardError => ex
          p ">>> #{ex} url=#{efetch} title=#{article_xml.css('ArticleTitle').text}" unless ex.to_s =~ /Doi has already been taken/
        end
      end
    end
  end

  def efetch
    "#{EFETCH_URL}?db=pubmed&retmode=xml&WebEnv=#{@web_env}&query_key=1&retstart=#{PER_PAGE * @page}&retmax=#{PER_PAGE}&email=#{ENV['PUBMED_KEY']}&tool=#{ENV['PUBMED_SECRET']}"
  end

  def esearch
    "#{ESEARCH_URL}?db=pubmed&term=#{CGI::escape(@journal)}[journal]+#{CGI::escape(@year)}[pdat]&usehistory=y&retmax=#{PER_PAGE}&email=#{ENV['PUBMED_KEY']}&tool=#{ENV['PUBMED_SECRET']}"
  end

  def get_xml(url)
    Nokogiri::XML(
      open(url)
    )
  end

end
