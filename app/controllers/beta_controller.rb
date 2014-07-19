class BetaController < ApplicationController
  before_action :current_user

  def index
    return redirect_to("/login") unless @current_user

    @main_js = "//s3.amazonaws.com/www.curatescience.org/assets/main.js"
    if ENV["MAIN_JS_VERSION"]
      @main_js = "//s3.amazonaws.com/www.curatescience.org/assets/main-#{ENV["MAIN_JS_VERSION"]}.js"
    end
  end
end
