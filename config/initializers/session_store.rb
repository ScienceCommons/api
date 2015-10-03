# Be sure to restart your server when you modify this file.

if Rails.env == 'production' || Rails.env == 'staging'
  PaperSearchApi::Application.config.session_store :cookie_store, key: '_science_commons_api_session', :domain => ENV['DOMAIN'], secure: true
else
  PaperSearchApi::Application.config.session_store :cookie_store, key: '_science_commons_api_session'
end
