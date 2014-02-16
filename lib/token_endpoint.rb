class TokenEndpoint

  def call(env)
    authenticator.call(env)
  end

  private

  def authenticator
    Rack::OAuth2::Server::Token.new do |req, res|
      client = Oauth2::Client.find_by_identifier(req.client_id) || req.invalid_client!
      client.secret == req.client_secret || req.invalid_client!
      case req.grant_type
      when :refresh_token
        refresh_token = client.refresh_tokens.valid.find_by_token(req.refresh_token)
        req.invalid_grant! unless refresh_token
        res.access_token = refresh_token.access_tokens.create.to_bearer_token
      else
        # NOTE: extended assertion grant_types are not supported yet.
        req.unsupported_grant_type!
      end
    end
  end

end
