ENV["REDISTOGO_URL"] ||= 'redis://127.0.0.1'
uri = URI.parse(ENV["REDIS_URL"])
Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password, :thread_safe => true)
