class Replication < ActiveRecord::Base
  validates_presence_of :study_id, :replicating_study_id

  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  belongs_to :study
  belongs_to :replicating_study, :class_name => 'Study', :foreign_key => :replicating_study_id

  def as_json(opts={})
    super(opts).tap do |h|
      h[:replicating_study] = replicating_study.as_json if opts[:replications]
      h[:study] = study.as_json if opts[:replication_of]
      h
    end
  end

end
