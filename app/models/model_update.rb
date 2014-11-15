class ModelUpdate < ActiveRecord::Base
  belongs_to :changeable, polymorphic: true
  belongs_to :submitter, class_name: "User"
  belongs_to :approver, class_name: "User"

  validates_presence_of :changeable_id
  validates_presence_of :changeable_type
  validates_presence_of :changes

  before_save :check_for_automatic_approval

  def check_for_automatic_approval
    self.approved = self.submitter.can_curate?
  end
end
