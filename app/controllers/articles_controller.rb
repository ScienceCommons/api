class ArticlesController < ApplicationController
  before_filter :authenticate!

  def index
    opts = {
      from: 0 || params[:from],
      size: 20 || params[:size]
    }

    render json: Article.search(params[:q] || '*', opts)
  end

  def show
    render json: Article.find_by_id(params[:id].to_i)
  end
end
