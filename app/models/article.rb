class Article < ActiveRecord::Base
  validates_uniqueness_of :doi
  validates_presence_of :doi
end
