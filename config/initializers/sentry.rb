require 'raven'

Raven.configure do |config|
  config.environments = %w[ production ]
  config.dsn = ENV['SENTRY_DSN'] || '127.0.0.1'
  config.async = lambda { |event|
    Thread.new { Raven.send(event) }
  }
end
