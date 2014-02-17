$es = Stretcher::Server.new(ENV['ELASTIC_SEARCH_URL'] || 'http://127.0.0.1:9200')
$index = $es.index("papersearch_#{ENV['RAILS_ENV']}")
