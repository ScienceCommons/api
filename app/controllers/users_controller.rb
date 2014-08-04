require 'net/http'

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

  def beta_mail_list
    uri = URI('https://us7.api.mailchimp.com/2.0/lists/members.json')
    beta_params = { :apikey => "f7117b16cdaded8f5565d9b9cc3b25bc", :id => "fba08af7dd" }
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
  end

  private

  def user_params
    params.slice(:email, :name)
  end
end
