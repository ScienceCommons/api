# all of our jobs will inherit from this base job.
# it provides retry logic and can eventually be
# wired into statsd for anomaly detection.
#
# Example of enqueueing:
#
# Resque.enqueue_in(10.seconds, Workers::PlosAlmUpdateWorker, 1) 
class Workers::BaseJob
  extend Resque::Plugins::Retry

  def self.after_enqueue(*args)
    $statsd.increment("#{self.name}_after_enqueue") if ENV['STATSD_ENABLED']
  end
  
  def self.before_perform(*args)
    $statsd.increment("#{self.name}_before_perform") if ENV['STATSD_ENABLED']
  end

  def self.after_perform(*args)
    $statsd.increment("#{self.name}_after_perform") if ENV['STATSD_ENABLED']
  end

  def self.on_failure(exception, *args)    
    $statsd.increment("#{self.name}_on_failure") if ENV['STATSD_ENABLED']
  end
end
