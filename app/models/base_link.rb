module BaseLink
  def self.included(base)
    base.send :validates_presence_of, :name, :url, :study_id
    base.send :validates_format_of, :url, :with => /\A(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\z/, message: "must be valid url"
    base.send :belongs_to, :study
    base.send :belongs_to, :owner, :class_name => 'User', :foreign_key => :owner_id
    base.send :before_create do
      self.url = "http://#{self.url}" unless self.url =~ /^https?:/
    end
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i
      h
    end
  end
end
