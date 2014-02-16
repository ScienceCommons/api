class Oauth2::RefreshToken < ActiveRecord::Base
  include Oauth2Token
  self.default_lifetime = 99.year
  has_many :access_tokens
end
