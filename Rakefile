# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

require 'resque/tasks'
require 'resque/scheduler/tasks'
require 'resque/pool/tasks'

PaperSearchApi::Application.load_tasks

# this task will get called before resque:pool:setup
# and preload the rails environment in the pool manager
task "resque:setup" => :environment do
  # generic worker setup, e.g. Hoptoad for failed jobs
end
task "resque:pool:setup" do
  # close any sockets or files in pool manager
  ActiveRecord::Base.connection.disconnect!
  # and re-open them in the resque worker parent
  Resque::Pool.after_prefork do |job|
    Resque.redis.client.reconnect

    ActiveRecord::Base.connection_proxy.instance_variable_get(:@shards).each do |shard, connection_pool|
      connection_pool.disconnect!
    end
  end
end
