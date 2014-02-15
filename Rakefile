# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

require 'resque/tasks'
require 'resque_scheduler/tasks'

PaperSearchApi::Application.load_tasks

# this task will get called before resque:pool:setup
# and preload the rails environment in the pool manager
task "resque:pool:setup" do

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!

  Resque::Pool.after_fork do
    ActiveRecord::Base.connection_proxy.instance_variable_get(:@shards).each do |shard, connection_pool|
      connection_pool.disconnect!
    end
  end

end
