class OAuth2::AuthorizationCode < ActiveRecord::Base
  include Oauth2Token

  def access_token
    @access_token ||= expired!
  end
end
