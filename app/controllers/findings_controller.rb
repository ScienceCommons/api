class FindingsController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    render json: Article
      .find(article_id).studies
      .find(study_id).findings
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    render json: Article
      .find(article_id).studies
      .find(study_id).findings
      .find(params[:id])
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def create
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    finding_hash = params.select { |key,_| [:url, :name].include? key.to_sym }

    article = Article
      .find(article_id).studies
      .find(study_id).findings
      .create!(finding_hash)

    render json: article
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def update
    [:article_id, :study_id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i

    finding_hash = params.select { |key,_| [:url, :name].include? key.to_sym }

    article = Article
      .find(article_id).studies
      .find(study_id).findings
      .find(params[:id])
      .update!(finding_hash)

    render json: article
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end
end
