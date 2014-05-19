class Study < ActiveRecord::Base

  VALID_EFFECT_SIZES = [:d, :eta, :r, :phi, :eta_sqr, :partial_eta_sqr]

  has_many :findings
  belongs_to :article

  validates_presence_of :article_id

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
    if VALID_EFFECT_SIZES.include?(type.to_sym)
      self.effect_size = {} # only one effect size per study.
      self.effect_size[type.to_sym] = value
    else
      raise Exceptions::InvalidEffectSize.new("#{type} is not a valid effect size.")
    end
    self
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['created_at'] = h['created_at'].to_i
      h['updated_at'] = h['updated_at'].to_i
      h
    end
  end
end
