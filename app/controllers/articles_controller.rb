class ArticlesController < ApplicationController
  before_filter :authenticate!

  def index
    render json: {message: 'hello world!'}
  end
end
