class BookmarksController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: current_user.bookmarks.map{|bookmark| bookmark.as_json(bookmarkable: true)}
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def show
    id = params[:id] ? params[:id].to_i : -1
    render json: current_user.bookmarks.find(id).as_json(bookmarkable: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def create
    bookmark = current_user.bookmarks.create!({ bookmarkable: find_bookmarkable })
    render json: bookmark, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def destroy
    id = params[:id] ? params[:id].to_i : -1
    bookmark = current_user.bookmarks.find(id)
    bookmark.destroy
    render json: {success: true, data: bookmark}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  private

  def find_bookmarkable
    if ["article"].include?(params[:bookmarkable_type].downcase)
      model = params[:bookmarkable_type].capitalize.constantize
      return model.find(params[:bookmarkable_id].to_i)
    end
    raise "bookmarkable not found"
  end
end
