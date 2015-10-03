require 'raven'

Raven.configure do |config|
  config.environments = %w[ production staging ]
  config.dsn = ENV['SENTRY_DSN'] || '127.0.0.1'
  config.logger = Logger.new(STDOUT) if Rails.env == "test"
  config.async = lambda { |event|
    Thread.new { Raven.send(event) }
  }
#  config.ssl = {
#    :ca_file => '/usr/lib/ssl/certs/ca-certificates.crt'
#  }
end
