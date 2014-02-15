# Resque.enqueue_in(10.seconds, Workers::TestWorker, "Hello World!")
class Workers::TestWorker < Workers::BaseJob
  extend Resque::Plugins::ExponentialBackoff
  
  @backoff_strategy = [0, 5, 10]

  @queue = :test

   def self.perform(value)
    p value
    p Oauth2::Client.first
    raise "fail job"
   end
end
