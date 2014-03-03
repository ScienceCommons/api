namespace :elasticsearch do
  desc "Create elasticsearch index"
  task :create_index => :environment do
    $index.create({
      :settings => {
        :number_of_shards => ENV['ES_SHARD_COUNT'] ? ENV['ES_SHARD_COUNT'].to_i : 1,
        :number_of_replicas => ENV['ES_REPLICA_COUNT'] ? ENV['ES_REPLICA_COUNT'].to_i : 0
      }
    })
  end

  desc "Delete elasticsearch index" 
  task :delete_index => :environment do
    $index.delete
  end

end
