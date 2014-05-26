class ArticlesController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: Article.search(params[:q] || '*', opts)
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Article.find(params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def create
    article = Article.create!({
      doi: params[:doi],
      title: params[:title],
      publication_date: params[:publication_date] ? Date.parse(params[:publication_date]) : Time.now,
      abstract: params[:abstract]
    })

    # add the author list, and resave.
    if params[:authors]
      params[:authors].each do |author|
        article.add_author(
          author['first_name'],
          author['middle_name'],
          author['last_name']
        )
      end
      article.save!
    end

    ElasticMapper.index.refresh
    render json: article
  rescue ActiveRecord::RecordInvalid => ex
    render json: {error: ex.to_s, messages: ex.record.errors.instance_variable_get(:@messages) }, status: 500
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end
end
