class ReplicationsController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    render json: Article.find(article_id)
      .studies.find(study_id)
      .replications.as_json(replications: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    [:article_id, :study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i
    id = params[:id].to_i

    render json: Article.find(article_id)
      .studies.find(study_id)
      .replications.find(id)
      .as_json(replications: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def create
    [:article_id, :study_id, :replicating_study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i
    replicating_study_id = params[:replicating_study_id].to_i
    closeness = params[:closeness].to_i

    study = Article.find(article_id).studies.find(study_id)
    replicating_study = Article.find(article_id).studies.find(replicating_study_id)

    replication = study.add_replication(
      replicating_study,
      closeness
    )
    render json: replication.as_json(replications: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def update
    [:article_id, :study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i
    id = params[:id].to_i
    closeness = params[:closeness].to_i

    replication = Article.find(article_id)
      .studies.find(study_id)
      .replications.find(id)

    replication.update!({
      closeness: closeness
    })

    render json: replication.as_json(replications: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end
end
