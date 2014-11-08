class ArticlesController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    author_id = params[:author_id].to_i
    if author_id != 0
      render json: Author.find(author_id).articles
    else
      opts = {
        from: params[:from] ? params[:from].to_i : 0,
        size: params[:size] ? params[:size].to_i : 20
      }

      render json: Article.search(params[:q] || '*', opts)
    end
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Article.find(params[:id].to_i).as_json(:authors => true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def recent
    limit = params[:limit] ? params[:limit].to_i : 3
    render json: Article.order('updated_at DESC').limit(limit).to_a
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def recently_added
    limit = params[:limit] ? params[:limit].to_i : 3
    render json: Article.order('created_at DESC').limit(limit).to_a
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def create
    article = nil
    ActiveRecord::Base.transaction do
      article = Article.create!({
        doi: params[:doi],
        title: params[:title],
        publication_date: !params[:publication_date].blank? ? Date.parse(params[:publication_date]) : Time.now,
        abstract: params[:abstract],
        owner_id: current_user ? current_user.id : nil
      })

      # add the author list, and resave.
      if params[:authors]
        ids = params[:authors].map{|author| author["id"].to_i}
        article.authors = Author.find(ids)
        ids.each_with_index do |id, i|
          article.article_authors.find_by(:author_id => id).update_attributes!(:number => i)
        end
      end
      article.save!
    end

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: article.as_json(:authors => true), status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def update
    article = nil
    ActiveRecord::Base.transaction do
      article = Article.find(params[:id].to_i)

      # you can only edit articles you have created.
      render(json: {error: 'you can only edit articles that you create'}, status: 401) and return unless current_user == article.owner || current_user.admin

      article.abstract = params[:abstract] if params[:abstract]
      article.title = params[:title] if params[:title]
      article.publication_date = Date.parse(params[:publication_date]) if params[:publication_date]

      # add the author list, and resave.
      if !params[:authors].nil?
        ids = params[:authors].map{|author| author["id"].to_i}
        article.authors = Author.find(ids)
        ids.each_with_index do |id, i|
          article.article_authors.find_by(:author_id => id).update_attributes!(:number => i)
        end
        # article.authors.each_with_index{|a, i| a.number = i}
      end

      article.save!
    end

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: article.as_json(:authors => true)
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def destroy
    article = Article.find(params[:id].to_i)

    # you can only edit articles you have created.
    render(json: {error: 'you can only delete articles that you create'}, status: 401) and return unless current_user == article.owner || current_user.admin

    article.destroy!

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: {success: true, data: article}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end
end
