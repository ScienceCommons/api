ElasticMapper.server = Stretcher::Server.new(ENV['ELASTIC_SEARCH_URL'] || 'http://127.0.0.1:9200')
ElasticMapper.index_name = "papersearch_#{ENV['RAILS_ENV']}"
