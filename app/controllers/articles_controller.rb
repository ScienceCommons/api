class ArticlesController < ApplicationController
  before_filter :authenticate!

  def index
    render json: Article.search(params[:q] || '*')
  end
end
