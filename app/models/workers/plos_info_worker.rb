# Given the DOI of an article on PLOS, pulls the XML file for the
# article, and populates abstract, authors, etc. After updating,
# the article is re-indexed for search. 
class Workers::PlosInfoWorker < Workers::BaseJob
  extend Resque::Plugins::ExponentialBackoff
  
  @backoff_strategy = [0, 10, 60, 300, 1200]

  @queue = :plos

   def self.perform(doi)
    PlosInfo.new(doi).update
   end
end
