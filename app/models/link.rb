class Link < ActiveRecord::Base
  self.inheritance_column = :_type_disabled

  belongs_to :study

  validates_presence_of :study_id
  validates_presence_of :name
  validates_presence_of :url
  validates_presence_of :type
end
