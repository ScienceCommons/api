class Finding < ActiveRecord::Base
  validates_presence_of :name, :url, :study_id
  validates_format_of :url, :with => /\A(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\z/, message: "must be valid url"
  belongs_to :study
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  before_create do
    self.url = "http://#{self.url}" unless self.url =~ /^https?:/
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i
      h
    end
  end
end
