# Grab a page of PLOS ALM (article level metrics) data, and 
# update articles matching DOIs. If the DOI has never
# been observed before, an entry will be created in the
# database.
class Workers::PlosAlmUpdateWorker < Workers::BaseJob
  extend Resque::Plugins::ExponentialBackoff
  
  @backoff_strategy = [0, 10, 60, 300, 1200]

  @queue = :plos

   def self.perform(page)
      PlosAlm.new(page).update_articles
   end
end
