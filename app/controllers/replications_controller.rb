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
end
