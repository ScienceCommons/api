require 'raven'

Raven.configure do |config|
  config.dsn = ENV['SENTRY_DSN'] || '127.0.0.1'
end
