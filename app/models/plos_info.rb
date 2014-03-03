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
    article.update(info)
  end

  # extract additional article info from xml.
  def info
    xml = get_xml
    { abstract: xml.css('abstract').text }
  end

  # fetch xml representation of article from PLOS.
  def get_xml
    @xml ||= Nokogiri::XML(
      open("#{PLOS_INFO_URL}?uri=info:doi/#{CGI::escape(@doi)}&representation=XML")
    )
  end

end
