require 'rack/oauth2'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # we will instead be using an API token.
  # protect_from_forgery with: :exception

  around_filter :select_shard
  rescue_from Rack::OAuth2::Server::Resource::Bearer::Unauthorized, :with => :authorization_error

  # Handle sharding, currently we don't
  # shard, but it will be a nice to have.
  def select_shard(&block)
    Octopus.using(:master, &block)
  end

  def authenticate!
    unless request.env[Rack::OAuth2::Server::Resource::ACCESS_TOKEN]
      raise Rack::OAuth2::Server::Resource::Bearer::Unauthorized
    end
  end

  # any controller can render a 401 unauthorized by
  # raising Exceptions::AuthorizationError.
  def authorization_error
    render json: 'unauthorized', :status => :unauthorized
  end
  private :authorization_error
end
