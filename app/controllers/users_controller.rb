class UsersController < ApplicationController
  #before_filter :check_admin

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: User.search(params[:q] || '*', opts)
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def create
    user = User.new(user_params.merge({
      password: User::PLACEHOLDER_PASSWORD,
      password_confirmation: User::PLACEHOLDER_PASSWORD
    }))

    if user.save
      render json: user
    else
      render(json: {:errors => user.errors.full_messages})
    end
  end

  def show
    render json: User.find_by(id: params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def admins
    render json: User.where(admin: true).order("id DESC")
  end

  def toggle_admin
    user = User.find_by(id: params[:id].to_i)
    new_state = params[:state]
    if user.id == @current_user.id
      render json: {error: "You cannot modify your own record"}, status: 404
    elsif new_state.nil?
      render json: {error: "State is required"}, status: 404
    else
      user.admin = new_state
      user.save!
      render json: user
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  private

  def user_params
    params.slice(:email, :name)
  end
end
