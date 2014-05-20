class Replication < ActiveRecord::Base
  validates_presence_of :study_id, :replicating_study_id

  belongs_to :study
  belongs_to :replicating_study, :class_name => 'Study', :foreign_key => :replicating_study_id
end
