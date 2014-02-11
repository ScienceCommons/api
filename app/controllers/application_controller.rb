class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # we will instead be using an API token.
  # protect_from_forgery with: :exception

  around_filter :select_shard

  # Handle sharding, currently we don't
  # shard, but it will be a nice to have.
  def select_shard(&block)
    Octopus.using(:s1, &block)
  end
end
