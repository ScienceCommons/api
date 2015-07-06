class BaseLinkController < ApplicationController

  before_filter :check_can_curate, :only => [:create, :update, :destroy]

  def index
    [:study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    study_id = params[:study_id] ? params[:study_id].to_i : -1
    article_id = params[:article_id] ? params[:article_id].to_i : -1

    if article_id != -1
      render json: Article
        .find(article_id).studies
        .find(study_id).send(relationship_name)
    else
      render json: Study
        .find(study_id).send(relationship_name)
    end

  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def show
    [:study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    study_id = params[:study_id] ? params[:study_id].to_i : -1
    article_id = params[:article_id] ? params[:article_id].to_i : -1

    if article_id != -1
      render json: Article
        .find(article_id).studies
        .find(study_id).send(relationship_name)
        .find(params[:id])
      else
        render json: Study
          .find(study_id).send(relationship_name)
          .find(params[:id])
      end

  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def create
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    object_hash = params.select { |key,_| [:url, :name].include? key.to_sym }

    object = Article
      .find(article_id).studies
      .find(study_id).send(relationship_name)
      .create!(object_hash)

    render json: object, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def destroy
    [:article_id, :study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i
    object = Article.find(article_id).studies
      .find(study_id).send(relationship_name)
      .find(params[:id])

    render(json: {error: 'you can only delete objects that you create'}, status: 401) and return unless current_user == object.owner or object.owner.nil?

    object.destroy!

    render json: {success: true, data: object}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def update
    [:study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id] ? params[:article_id].to_i : -1
    study_id = params[:study_id] ? params[:study_id].to_i : -1

    object_hash = params.select { |key,_| [:url, :name].include? key.to_sym }

    if article_id != -1
      object = Article
        .find(article_id).studies
        .find(study_id).send(relationship_name)
        .find(params[:id])
        .update!(object_hash)
      else
        object = Study
          .find(study_id).send(relationship_name)
          .find(params[:id])
          .update!(object_hash)
      end

    render json: object
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  private
  # use the name of the controller to determine
  # the underlying model that we should interact with.
  def relationship_name
    controller_name.classify.downcase.pluralize.to_sym
  end
end
