class FeedbackMessagesController < ApplicationController

  before_action :authenticate_user!

  def create
    feedback_message = current_user.feedback_messages.create!(message: params[:message], details: params[:details])
    render json: feedback_message, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end
end
