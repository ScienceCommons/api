class InvitesController < BaseLinkController
  before_action :authenticate_user!

  def create
    current_user.send_invite(params[:email])
    render json: {message: 'sent invite'}, status: 201
  rescue Exceptions::NoInvitesAvailable => ex
    render json: {error: 'no invites remaining'}, status: 500
  rescue StandardError => ex
    render json: {error: "unknown error"}, status: 500
  end
end
