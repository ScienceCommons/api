class Oauth2::Client < ActiveRecord::Base
  has_many :access_tokens
  has_many :refresh_tokens

  before_validation :setup, :on => :create
  validates :secret, :presence => true
  validates :identifier, :name, :presence => true, :uniqueness => true
  
  private

  def setup
    self.identifier = SecureToken.generate(16)
    self.secret = SecureToken.generate
  end
end
