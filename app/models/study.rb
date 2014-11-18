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

  validates_presence_of :article_id
  validates_numericality_of :n, greater_than: 0, only_integer: true, unless: "n.blank?"
  validates_numericality_of :power, greater_than: 0, less_than: 1, unless: "power.blank?"

  # independent and dependent variables
  # are stored as serialized arrays.
  serialize :independent_variables
  serialize :dependent_variables

  # effect size is stored as a serialized hash.
  serialize :effect_size

  # Independent, and Dependent variables
  # are represented as an array of strings.
  before_create do
    self.independent_variables = []
    self.dependent_variables = []
    self.effect_size = {}
  end

  def add_dependent_variables(variable)
    self.dependent_variables << variable
    self
  end

  def add_independent_variables(variable)
    self.independent_variables << variable
    self
  end

  def set_effect_size(type, value)
    if VALID_EFFECT_SIZES.include?(type)
      self.effect_size = {} # only one effect size per study.
      self.effect_size[type] = value
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
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i

      # optionally serialize various amounts of
      # relational data.
      h[:authors] = self.article.authors if opts[:authors]
      h[:publication_date] = self.article.publication_date if opts[:year]
      h[:findings] = self.findings if opts[:findings]
      h[:materials] = self.materials if opts[:materials]
      h[:registrations] = self.registrations if opts[:registrations]
      h[:replications] = self.replications.as_json(opts.merge(:authors => true, :year => true)) if opts[:replications]
      h[:replication_of] = self.replication_of.as_json(opts.merge(:authors => true, :year => true)) if opts[:replication_of]
      h[:links] = self.links
      h
    end
  end
end
