class Study < ActiveRecord::Base

  VALID_EFFECT_SIZES = [:d, :eta, :r, :phi, :eta_sqr, :partial_eta_sqr]

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

  def add_dependent_variable(variable)
    self.dependent_variables << variable
    self
  end

  def add_independent_variable(variable)
    self.independent_variables << variable
    self
  end

  def set_effect_size(type, value)
    if VALID_EFFECT_SIZES.include?(type)
      self.effect_size[type] = value
    else
      raise Exceptions::InvalidEffectSize.new("#{type} is not a valid effect size.")
    end
    self
  end
end
