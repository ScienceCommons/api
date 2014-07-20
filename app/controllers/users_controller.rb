class UsersController < ApplicationController
  before_filter :check_admin

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: User.search(params[:q] || '*', opts)
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: User.find(params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end
end
