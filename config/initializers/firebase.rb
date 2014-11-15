FIREBASE_CLIENT = Firebase::Client.new(ENV["FIREBASE_URL"], ENV["FIREBASE_SECRET"]) if Rails.env == "production"
