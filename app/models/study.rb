class Study < ActiveRecord::Base

  VALID_EFFECT_SIZES = ['d', 'eta', 'r', 'phi', 'eta_sqr', 'partial_eta_sqr']

  has_many :findings
  has_many :materials
  has_many :replications
  has_many :registrations
  has_many :links
  has_many :replication_of, :class_name => 'Replication', :foreign_key => :replicating_study_id
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  belongs_to :article
  has_many :model_updates, as: :changeable, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  validates_presence_of :article_id
  validates_numericality_of :n, greater_than: 0, only_integer: true, unless: "n.blank?"
  validates_numericality_of :power, greater_than: 0, less_than: 1, unless: "power.blank?"

  after_initialize :default_values

  def add_dependent_variables(variable)
    self.dependent_variables_will_change!
    self.dependent_variables << variable
    self
  end

  def add_independent_variables(variable)
    self.independent_variables_will_change!
    self.independent_variables << variable
    self
  end

  def set_effect_size(type, value)
    if VALID_EFFECT_SIZES.include?(type)
      hash = {}
      hash[type] = value
      self.effect_size = hash # only one effect size per study.
    else
      raise Exceptions::InvalidEffectSize.new("#{type} is not a valid effect size.")
    end
    self
  end

  def add_replication(replicating_study, closeness=0, owner=nil)
    self.replications.create!(
      replicating_study_id: replicating_study.id,
      closeness: closeness,
      owner_id: owner ? owner.id : nil
    )
  end

  def as_json(opts={})
    super(opts).tap do |h|
      # optionally serialize various amounts of
      # relational data.
      h[:authors] = self.article.authors if opts[:authors]
      h[:publication_date] = self.article.publication_date if opts[:year]
      h[:findings] = self.findings if opts[:findings]
      h[:materials] = self.materials if opts[:materials]
      h[:registrations] = self.registrations if opts[:registrations]
      h[:replications] = self.replications.as_json(opts.merge(:authors => true, :year => true)) if opts[:replications]
      h[:replication_of] = self.replication_of.as_json(opts.merge(:authors => true, :year => true)) if opts[:replication_of]
      h[:links] = self.links.as_json(:comments => opts[:comments])
      h[:comments] = self.comments.as_json() if opts[:comments]
      h[:model_updates] = self.model_updates if opts[:model_updates]
      h
    end
  end

  private

  def default_values
    self.dependent_variables ||= []
    self.independent_variables ||= []
    self.effect_size ||= {}
  end
end
