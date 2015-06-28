require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module PaperSearchApi
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    I18n.enforce_available_locales = false

    # GZIP our API results.
    config.middleware.use Rack::Deflater

    # open up CORS for OAuth 2.0 API.
    # we should eventually audit this.
    #config.action_dispatch.default_headers = {
    #    'Access-Control-Allow-Origin' => '*',
    #    'Access-Control-Request-Method' => '*'
    #}

    config.autoload_paths << File.join(Rails.root, 'lib')
    config.action_controller.permit_all_parameters = true

    # add fonts directory to asset pipeline
    config.assets.paths << Rails.root.join("app", "assets", "fonts")

    # OAuth2 Resource Server
    require 'rack/oauth2'
    config.middleware.use Rack::OAuth2::Server::Resource::Bearer, 'Rack::OAuth2 Article Search API' do |req|
        Oauth2::AccessToken.valid.find_by_token(req.access_token) || req.invalid_token!
    end

    # Setup SES as our mailer.
    ActionMailer::Base.add_delivery_method :ses, AWS::SES::Base,
      :access_key_id => ENV['AWS_SES_ID'] || "foobar",
      :secret_access_key => ENV['AWS_SES_KEY'] || "foobar",
      :server => ENV['AWS_SES_SERVER'] || "foobar",
      :perform_deliveries => Rails.env != "test"
    end
end
