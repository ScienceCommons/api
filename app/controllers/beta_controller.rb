class BetaController < ApplicationController
  before_action :current_user
  before_filter :ensure_proper_subdomain, :only => "index"

  def index
    if Rails.env == "production"
      @main_js = ENV["PROD_MAIN_JS"]
    else
      @main_js = ENV["TEST_MAIN_JS"]
    end
  end

  def search
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    multi = ElasticMapper::MultiSearch.new({
      articles: Article,
      authors: Author
    })

    res = multi.search(params[:q] || '*', opts)
    documents = []

    res['documents'].each do |doc|
      case doc.class.name
      when 'Article'
        json = doc.as_json(:authors => true)
        json['type'] = 'Article'
        documents << json
      when 'Author'
        json = doc.as_json(:article_count => true)
        json['type'] = 'Author'
        documents << json
      end
    end
    res['documents'] = documents

    render json: res
  end

  private

  def ensure_proper_subdomain
    if Rails.env == 'production' && request.subdomain != 'www'
      redirect_to subdomain: 'www', :controller => 'beta', :action => "index"
    end
  end
end
