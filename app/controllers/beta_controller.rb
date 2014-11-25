class BetaController < ApplicationController
  before_action :current_user

  def index
    prefix = params[:test_js] ? "test" : "www"
    @main_js = "//s3.amazonaws.com/#{prefix}.curatescience.org/assets/main.js"
    if ENV["MAIN_JS_VERSION"]
      @main_js = "//s3.amazonaws.com/#{prefix}.curatescience.org/assets/main-#{ENV["MAIN_JS_VERSION"]}.js"
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
end
