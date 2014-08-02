# load a page of pubmed articles, and create
# corresponding articles in CurateScience.
class Workers::PubmedWorker < Workers::BaseJob
  extend Resque::Plugins::ExponentialBackoff

  @backoff_strategy = [0, 10, 60, 300, 1200]

  @queue = :pubmed

  def self.perform(journal, year, page, web_env)
    Pubmed.new(journal, year, page, web_env).create_articles
  end
end
