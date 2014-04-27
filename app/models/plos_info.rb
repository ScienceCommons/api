# Hits PLOS' info endpoint, and pulls abstract,
# authors, and other info.
class PlosInfo

  PLOS_INFO_URL = 'http://www.plosone.org/article/fetchObjectAttachment.action'

  def initialize(doi)
    @doi = doi
  end

  # update PLOS article with additional info.
  def update
    article = Article.find_by_doi(@doi)
    raise 'article not found' unless article
    update_article(article)
  end

  # extract additional article info from xml.
  def update_article(article)
    xml = get_xml

    article.abstract = xml.css('abstract').text

    xml.css('contrib[contrib-type=author]').each do |node|
      first_name, middle_name = node.css('given-names').text.split(' ')
      article.add_author(
        first_name,
        middle_name,
        node.css('surname').text
      )
    end

    article.save
  end

  # fetch xml representation of article from PLOS.
  def get_xml
    @xml ||= Nokogiri::XML(
      open("#{PLOS_INFO_URL}?uri=info:doi/#{CGI::escape(@doi)}&representation=XML")
    )
  end

end
