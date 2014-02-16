web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
scheduler: bundle exec rake resque:scheduler
worker: bundle exec resque-pool