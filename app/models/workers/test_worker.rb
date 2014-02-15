class Workers::TestWorker < Workers::BaseJob
  @backoff_strategy = [0, 30, 60, 300, 900, 3600, 10800]

  @queue = :test

   def self.perform(value)
    p value
   end
end
