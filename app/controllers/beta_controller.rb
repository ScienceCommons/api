class BetaController < ApplicationController
  def index
    @main_js = "http://www.curatescience.org.s3-website-us-east-1.amazonaws.com/assets/main.js"
    if ENV["MAIN_JS_VERSION"]
      @main_js = "http://www.curatescience.org.s3-website-us-east-1.amazonaws.com/assets/main-#{ENV["MAIN_JS_VERSION"]}.js"
    end
  end
end
