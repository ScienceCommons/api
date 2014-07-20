require 'rack/oauth2'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # we will instead be using an API token.
  # protect_from_forgery with: :exception

  before_filter :set_headers
  around_filter :select_shard
  rescue_from Rack::OAuth2::Server::Resource::Bearer::Unauthorized, :with => :authorization_error

  private

  def set_headers
    if request.headers["HTTP_ORIGIN"] && (
      /^https?:\/\/(.*)\.curatescience\.org/i.match(request.headers["HTTP_ORIGIN"]) ||
      /^https?:\/\/localhost:8000$/i.match(request.headers["HTTP_ORIGIN"])
    )
      headers['Access-Control-Allow-Origin'] = request.headers["HTTP_ORIGIN"]
      headers['Access-Control-Allow-Credentials'] = 'true'
    else
      headers['Access-Control-Allow-Origin'] = '*'
    end
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version, Content-Type'
    headers['Access-Control-Max-Age'] = '1728000'

    if request.method == "OPTIONS"
      render :text => '', :content_type => 'text/plain'
    end
  end

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

  def authenticate_user!
    raise Rack::OAuth2::Server::Resource::Bearer::Unauthorized unless current_user
  end

  def check_admin
    raise Rack::OAuth2::Server::Resource::Bearer::Unauthorized unless current_user.try(:admin)
  end

  # any controller can render a 401 unauthorized by
  # raising Exceptions::AuthorizationError.
  def authorization_error
    render json: 'unauthorized', :status => :unauthorized
  end

  def redirect_https
    if Rails.env.production?
      redirect_to :protocol => "https://" unless request.ssl?
    end
  end
  before_filter :redirect_https

  def render_error(error)
    if error.kind_of?(ActiveRecord::RecordInvalid)
      render json: {error: error.to_s, messages: error.record.errors.instance_variable_get(:@messages)}, status: 500
    else
      render json: {error: error.to_s}, status: 500
    end
  end

  def current_user
    if env['warden'].user
      @current_user ||= env['warden'].user
    else
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end
    @current_user
  end
end
