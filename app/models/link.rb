class Link < ActiveRecord::Base
  self.inheritance_column = :_type_disabled
  
  belongs_to :study
end
