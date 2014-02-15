$statsd = Statsd.new(ENV['STATSD_HOST']).tap { |sd| sd.namespace = ENV['STATSD_NAMESPACE'] }
