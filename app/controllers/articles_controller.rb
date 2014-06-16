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
    render json: {error: 'unknown error'}, status: 500
  end

  def create
    article = Article.create!({
      doi: params[:doi],
      title: params[:title],
      publication_date: params[:publication_date] ? Date.parse(params[:publication_date]) : Time.now,
      abstract: params[:abstract],
      owner_id: current_user ? current_user.id : nil
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

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: article, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def update
    article = Article.find(params[:id].to_i)

    # you can only edit articles you have created.
    render(json: {error: 'you can only edit articles that you create'}, status: 401) and return unless current_user == article.owner

    article.abstract = params[:abstract] if params[:abstract]
    article.title = params[:title] if params[:title]
    article.publication_date = Date.parse(params[:publication_date]) if params[:publication_date]

    if params[:authors]
      # reset to empty authors array,
      # we expect the UI will always send
      # a list of all the authors in.
      article.authors_denormalized = []

      params[:authors].each do |author|
        article.add_author(
          author['first_name'],
          author['middle_name'],
          author['last_name']
        )
      end
    end

    article.save!

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: article
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def destroy
    article = Article.find(params[:id].to_i)

    # you can only edit articles you have created.
    render(json: {error: 'you can only delete articles that you create'}, status: 401) and return unless current_user == article.owner

    article.destroy!

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: {success: true, data: article}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end
end
