class ReplicationOfController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    [:study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

   
    study_id = params[:study_id] ? params[:study_id].to_i : -1
    article_id = params[:article_id] ? params[:article_id].to_i : -1

    if params[:article_id] 
      article_id = params[:article_id].to_i

      render json: Article.find(article_id)
        .studies.find(study_id)
        .replication_of.as_json(replication_of: true)
    else
      render json: Study.find(study_id)
        .replication_of.as_json(replication_of: true)
    end

  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    [:study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    study_id = params[:study_id] ? params[:study_id].to_i : -1
    article_id = params[:article_id] ? params[:article_id].to_i : -1
    id = params[:id] ? params[:id].to_i : -1

    if params[:article_id]

      article_id = params[:article_id].to_i
      
      render json: Article.find(article_id)
        .studies.find(study_id)
        .replication_of.find(id)
        .as_json(replication_of: true)
    else
      render json: Study.find(study_id)
        .replication_of.find(id)
        .as_json(replication_of: true)
    end


  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

end
