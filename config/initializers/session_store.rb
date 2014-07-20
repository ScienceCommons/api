# Be sure to restart your server when you modify this file.

PaperSearchApi::Application.config.session_store :cookie_store, key: '_science_commons_api_session', :domain => :all, secure: Rails.env == 'production'
