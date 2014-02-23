class ArticlesController < ApplicationController
  before_filter :authenticate!

  def index
    render json: Article.all
  end
end
