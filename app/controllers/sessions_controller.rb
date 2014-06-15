# http://stackoverflow.com/questions/4857855/extending-devise-sessionscontroller-to-authenticate-using-json.
class SessionsController < Devise::SessionsController
  def create
    if warden.authenticate(:scope => resource_name)
      render :json => {success: true}, status: 201
    else
      render :json => {success: false}, status: 401
    end
  end

  def destroy
    super
  end
end
