class CommentsController < ApplicationController
  before_action :authenticate_user!, :except => [:index, :show]
  #before_filter :authenticate!

  def index
    commentable_type = params[:commentable_type].camelize.singularize
    if commentable_type == "User"
      render status: 404 unless current_user
      render json: current_user.comments.order(created_at: :asc).as_json(:comments => true, :current_user_id => current_user.try(:id))
    else
      query = {
        :commentable_type => commentable_type,
        :commentable_id => params[:commentable_id].to_i
      }
      query[:field] = params[:field].to_s if params[:field]

      render json: Comment.where(query).order(created_at: :asc).as_json(:comments => true, :current_user_id => current_user.try(:id))
    end
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Comment.find(params[:id].to_i).as_json(:comments => true, :current_user_id => current_user.try(:id))
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def create
    comment = Comment.new(
      :owner_id => current_user.id,
      :comment => params[:comment].to_s,
      :commentable_type => params[:commentable_type].camelize.singularize,
      :commentable_id => params[:commentable_id].to_i,
      :anonymous => params[:anonymous] || false
    )
    comment.field = params[:field].to_s if params[:field]
    comment.save!
    render json: comment, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def set_non_anonymous
    comment = current_user.comments.find(params[:id].to_i)
    comment.update_attributes!(anonymous: false)
    render json: comment, status: 200
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def destroy
    comment = Comment.find(params[:id].to_i)
    if current_user.admin || current_user == comment.owner
      comment.destroy!
      render json: {success: true, data: comment}, status: 204
    else
      render(json: {error: 'you can only delete comments that you create'}, status: 401)
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end
end
