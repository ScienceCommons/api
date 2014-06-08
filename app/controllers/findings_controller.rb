class FindingsController < ApplicationController
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

      render json: Article
        .find(article_id).studies
        .find(study_id).findings
    else
      render json: Study 
        .find(study_id).findings
    end

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

    finding = Article
      .find(article_id).studies
      .find(study_id).findings
      .create!(finding_hash)

    render json: finding
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

    finding = Article
      .find(article_id).studies
      .find(study_id).findings
      .find(params[:id])
      .update!(finding_hash)

    render json: finding
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def destroy
    [:article_id, :study_id, :id].each do |k|
      raise "#{k} must be provided" if params[k].nil?
    end

    article_id = params[:article_id].to_i
    study_id = params[:study_id].to_i
    finding = Article.find(article_id).studies
      .find(study_id).findings
      .find(params[:id])

    render(json: {error: 'you can only delete findings that you create'}, status: 401) and return unless current_user == finding.owner or finding.owner.nil?

    finding.destroy!

    render json: finding
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end
end
