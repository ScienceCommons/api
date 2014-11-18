class ModelUpdate < ActiveRecord::Base
  enum operation: [ :model_created, :model_updated, :model_deleted ]

  belongs_to :changeable, polymorphic: true
  belongs_to :submitter, class_name: "User"
  belongs_to :approver, class_name: "User"

  validates_presence_of :changeable_id
  validates_presence_of :changeable_type
  validates_presence_of :changes

  before_save :check_for_automatic_approval
  after_save :notify_firebase

  def check_for_automatic_approval
    if self.submitter.can_curate?
      self.approved = self.submitter.can_curate?
      self.approver = self.submitter
    end
  end

  def notify_firebase
    if !defined?(FIREBASE_CLIENT).nil? && self.approved
      # FIREBASE_CLIENT.push("ModelUpdates", self)
      data = {
        user: self.submitter.email,
        fields: self.model_changes.keys.sort,
        changeable_id: self.changeable_id,
        changeable_type: self.changeable_type,
        label: self.label,
        created_at: self.created_at,
        operation: self.operation
      }
      if self.changeable.class.name == "Study"
        data[:parent] = {
          label: self.changeable.article.title,
          id: self.changeable.article.id
        }
      end
      FIREBASE_CLIENT.push("ModelUpdates", data)
      model_name = self.changeable.class.model_name.human.pluralize.downcase
      data["model_changes"] = self.model_changes
      FIREBASE_CLIENT.push("#{model_name}/#{self.changeable_id}/changes", data)
    end
  end

  def label
    case self.changeable.class.name
    when "Study"
      return self.changeable.number
    when "Article"
      return self.changeable.title
    when "Author"
      return self.changeable.full_name
    end
  end
end
