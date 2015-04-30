class ArticlesController < ApplicationController
  #before_filter :authenticate!

  before_filter :authenticate_user!
  before_filter :check_can_curate, :only => [:create, :update, :destroy]

  def index
    author_id = params[:author_id].to_i
    if author_id != 0
      render json: Author.find(author_id).articles.as_json(:authors => true)
    else
      opts = {
        from: params[:from] ? params[:from].to_i : 0,
        size: params[:size] ? params[:size].to_i : 20
      }

      res = Article.search(params[:q] || '*', opts)
      documents = res['documents'].map do |doc|
        doc.as_json(:authors => true)
      end

      res['documents'] = documents
      render json: res
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
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
    render json: Article.order('updated_at DESC').limit(limit).as_json(:authors => true)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def recently_added
    limit = params[:limit] ? params[:limit].to_i : 3
    render json: Article.order('created_at DESC').limit(limit).as_json(:authors => true)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def create
    article = nil
    binding.pry
    ActiveRecord::Base.transaction do
      article = Article.create!({
        doi: params[:doi],
        title: params[:title],
        journal_title: params[:journal_title],
        publication_date: !params[:publication_date].blank? ? Date.parse(params[:publication_date]) : Time.now,
        abstract: params[:abstract],
        owner: current_user,
        tags: params[:tags]
      })

      # add the author list, and resave.
      if params[:authors]
        ids = params[:authors].map{|author| author["id"].to_i}
        article.authors = Author.find(ids)
        ids.each_with_index do |id, i|
          article.article_authors.find_by(:author_id => id).update_attributes!(:number => i)
        end
      end
      article.model_updates.create!(:submitter => current_user, :model_changes => article.changes, :operation => :model_created)
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
    binding.pry
    ActiveRecord::Base.transaction do
      article = Article.find(params[:id].to_i)
      article.abstract = params[:abstract] if params.has_key?(:abstract)
      article.title = params[:title] if params.has_key?(:title)
      article.journal_title = params[:journal_title] if params.has_key?(:journal_title)
      article.publication_date = Date.parse(params[:publication_date]) if params.has_key?(:publication_date)
      article.tags = params[:tags] if params.has_key?(:tags)
      article.doi = params[:doi] if params.has_key?(:doi)
      if params.has_key?(:authors)
        if params[:authors].blank?
          article.article_authors.destroy_all
        else
          ids = params[:authors].map{|author| author["id"].to_i}
          article.authors = Author.find(ids)
          ids.each_with_index do |id, i|
            article.article_authors.find_by(:author_id => id).update_attributes!(:number => i)
          end
        end
      end
      if article.changed?
        article.model_updates.create!(:submitter => current_user, :model_changes => article.changes, :operation => :model_updated)
      end
      if article.save
        render json: article.as_json(:authors => true)
        ElasticMapper.index.refresh
      else
        render_error(ex)  
      end
    end
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    article = Article.new
    article.abstract = params[:abstract] if params.has_key?(:abstract)
    article.title = params[:title] if params.has_key?(:title)
    article.journal_title = params[:journal_title] if params.has_key?(:journal_title)
    article.publication_date = Date.parse(params[:publication_date]) if params.has_key?(:publication_date)
    article.tags = params[:tags] if params.has_key?(:tags)
    article.doi = params[:doi] if params.has_key?(:doi)
    ids = params[:authors].map{|author| author["id"].to_i}
    ids.each{|id| article.authors << Author.find(id)}
    if article.save
      render json: article.as_json(:authors => true)
    else  
      render json: {error: "article didn't save"}, status: 404
    end
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def find_doi
    article = Article.find(params[:id].to_i)
    article = article.find_doi(params[:doi])
    raise ActiveRecord::RecordNotFound if article.blank?
    render json: article.as_json(:authors => true)
  rescue ActiveRecord::RecordNotFound => ex
    article = Article.new.find_doi(params[:doi])
    if article.present?
      render json: article.as_json(:authors => true)
    else
      render json: {error: "DOI not found"}, status: 404
    end
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

def destroy
    article = Article.find(params[:id].to_i)
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
