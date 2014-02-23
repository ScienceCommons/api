module ElasticSearchHelpers
  # sanitize a search query for Lucene. Useful if the original
  # query raises an exception, due to bad adherence to DSL.
  # Taken from here:
  #
  # http://stackoverflow.com/questions/16205341/symbols-in-query-string-for-elasticsearch
  #
  def sanitize_query(str)
    # Escape special characters
    # http://lucene.apache.org/core/old_versioned_docs/versions/2_9_1/queryparsersyntax.html#Escaping Special Characters
    escaped_characters = Regexp.escape('\\+-&|!(){}[]^~*?:\/')
    str = str.gsub(/([#{escaped_characters}])/, '\\\\\1')

    # AND, OR and NOT are used by lucene as logical operators. We need
    # to escape them
    ['AND', 'OR', 'NOT'].each do |word|
      escaped_word = word.split('').map {|char| "\\#{char}" }.join('')
      str = str.gsub(/\s*\b(#{word.upcase})\b\s*/, " #{escaped_word} ")
    end

    # Escape odd quotes
    quote_count = str.count '"'
    str = str.gsub(/(.*)"(.*)/, '\1\"\3') if quote_count % 2 == 1

    str
  end

  def search(query, opts={})

    query_sanitized = false
    opts[:sort] = opts[:sort] || [{_score: 'desc'}]

    # perform an elasticsearch query, scoped to the users id.
    begin
      res = $index.type(table_name).search({ size: 12, query: {
          "bool" => {
            "must" => [
              # This pattern can be used to support
              # multiple tennants.
              # {"term" => {"user_id" => id}},
              {"query_string" => {"query" => query}}
            ]
          }
        }
      }.merge(opts))
    rescue Stretcher::RequestError => e
      # the first time a query fails, attempt to
      # sanitize the query and retry the search.
      # This gives users the power of the Lucene DSL
      # while protecting them from badly formed queries.
      if query_sanitized
        raise e
      else
        query = ElasticSearchHelpers.sanitize_query(query)
        query_sanitized = true
        retry
      end
    end

    res
=begin
    # allow methods like find_collection to override the
    # result set of profiles that is returned.
    if block_given?
      yield res
    else
      res.results.map do |result|

        # ignore missing profiles when performing a search.
        begin
          profiles.find(result.profile_id) unless result.profile_id.blank?
        rescue Mongoid::Errors::DocumentNotFound
          next # just move to the next result.
        end

      end.compact
    end
=end
  end
end
