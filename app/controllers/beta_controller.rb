class BetaController < ApplicationController
  before_action :current_user

  def index
    prefix = params[:test_js] ? "test" : "www"
    @main_js = "//s3.amazonaws.com/#{prefix}.curatescience.org/assets/main.js"
    if ENV["MAIN_JS_VERSION"]
      @main_js = "//s3.amazonaws.com/#{prefix}.curatescience.org/assets/main-#{ENV["MAIN_JS_VERSION"]}.js"
    end
  end
end
