class ArticlesController < ApplicationController
  before_action :authenticate_user!
  before_filter :authenticate!

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: Article.search(params[:q] || '*', opts)
  end

  def show
    render json: Article.find_by_id(params[:id].to_i)
  end
end
