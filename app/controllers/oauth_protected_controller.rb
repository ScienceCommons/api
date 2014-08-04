# used for testing purposes until we actually expose
# our API as an OAuth 2.0 API.
class OauthProtectedController < ApplicationController
  before_filter :authenticate!

  def index
    render json: {}, status: 200
  end
end
