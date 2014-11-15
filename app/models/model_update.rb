class ModelUpdate < ActiveRecord::Base
  belongs_to :changeable, polymorphic: true
  belongs_to :submitter, class_name: "User"
  belongs_to :approver, class_name: "User"

  validates_presence_of :changeable_id
  validates_presence_of :changeable_type
  validates_presence_of :changes

  before_save :check_for_automatic_approval
  after_save :notify_firebase

  def check_for_automatic_approval
    self.approved = self.submitter.can_curate?
  end

  def notify_firebase
    if !defined?(FIREBASE_CLIENT).nil? && self.approved
      FIREBASE_CLIENT.push("ModelUpdates", self)
      # model_name = self.changeable.class.model_name.human.pluralize
      # FIREBASE_CLIENT.push("#{model_name}/#{self.changeable_id}/changes", self)
    end
  end
end
