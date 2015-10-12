class LinksController < ApplicationController

  before_filter :check_can_curate, :only => [:create, :update, :destroy]

  def index
    return render_error('study_id must be provided') if params[:study_id].nil?
    study_id = params[:study_id].to_i
    render json: Study.find(study_id).links
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def create
    return render_error('study_id must be provided') if params[:study_id].nil?
    study = Study.find(params[:study_id].to_i)
    render(json: {error: 'you can only delete links for studies that you create'}, status: 401) and return unless current_user.admin or (current_user == study.owner) or study.owner.nil?

    link = study.links.create!({
      name: params['name'],
      url: params['url'],
      type: params['type']
    })

    study.article.update(updater: current_user) if current_user

    render json: link, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def update
    link = Link.find(params[:id].to_i)
    render(json: {error: 'you can only delete links for studies that you create'}, status: 401) and return unless current_user.admin or (current_user == link.study.owner) or link.study.owner.nil?

    link.study_id = params[:study_id].to_i if params[:study_id]
    link.name = params[:name] if params[:name]
    link.url = params[:url] if params[:url]
    link.type = params[:type] if params[:type]

    link.save!
    link.study.article.update(updater: current_user) if current_user
    render json: link
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
      render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def destroy
    link = Link.find(params[:id].to_i)
    study = link.study
    render(json: {error: 'you can only delete links for studies that you create'}, status: 401) and return unless current_user.admin or (current_user == study.owner) or study.owner.nil?

    link.destroy!

    render json: {success: true, data: study}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end
end
