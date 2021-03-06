class InvitesController < BaseLinkController
  before_action :authenticate_user!

  def create
    render json: current_user.send_invite(params[:email]), status: 201
  rescue Exceptions::NoInvitesAvailable => ex
    render json: {error: 'no invites remaining'}, status: 500
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end
end
