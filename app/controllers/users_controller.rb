require 'net/http'

class UsersController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  before_filter :check_admin, :except => [:update]

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: User.search(params[:q] || '*', opts)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: User.find_by(id: params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def update
    return render(json: {error: 'you can only edit your user'}, status: 401) if current_user.id != params[:id]

    user = User.find(params[:id].to_i)
    user.name = params[:name] if params[:name]
    user.save!
    render json: user
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def admins
    render json: User.where(admin: true).order("created_at DESC")
  end

  def curators
    render json: User.where(curator: true).order("created_at DESC")
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
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def toggle_curator
    user = User.find_by(id: params[:id].to_i)
    new_state = params[:state]
    if user.id == @current_user.id
      render json: {error: "You cannot modify your own record"}, status: 404
    elsif new_state.nil?
      render json: {error: "State is required"}, status: 404
    else
      user.curator = new_state
      user.save!
      render json: user
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def beta_mail_list
    uri = URI('https://us7.api.mailchimp.com/2.0/lists/members.json')
    beta_params = { :apikey => ENV['MAILCHIMP_API_KEY'], :id => ENV['MAILCHIMP_ID'] }
    uri.query = URI.encode_www_form(beta_params)
    res = Net::HTTP.get_response(uri)

    if res.is_a?(Net::HTTPSuccess)
      emails = JSON.parse(res.body)["data"].map{|member| member["email"]}
      registered_users = User.where(email: emails).index_by(&:email)

      beta_users = emails.map do |email|
        beta_user_data = {email: email}
        beta_user_data[:id] = registered_users[email].id if registered_users[email]
        beta_user_data
      end

      render json: beta_users
    else
      render json: {error: 'unknown error'}, status: 500
    end
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  private

  def user_params
    params.slice(:email, :name)
  end
end
