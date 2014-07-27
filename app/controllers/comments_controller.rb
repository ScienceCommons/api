class CommentsController < ApplicationController
  before_action :authenticate_user!, :except => [:index, :show]
  #before_filter :authenticate!

  def index
    query = Comment.where(
      :commentable_type => params[:commentable_type].camelize,
      :commentable_id => params[:commentable_id].to_i
    )
    query.and.where(:field => params[:field].to_s) if params[:field]
    render json: query
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Comment.find(params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def create
    comment = Comment.new(
      :owner_id => current_user.id,
      :comment => params[:comment].to_s,
      :commentable_type => params[:commentable_type].camelize.singularize,
      :commentable_id => params[:commentable_id].to_i
    )
    comment.field = params[:field].to_s if params[:field]
    comment.save!
    render json: comment, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
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
    render json: {error: 'unknown error'}, status: 500
  end
end
