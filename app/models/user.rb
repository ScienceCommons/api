class User < ActiveRecord::Base

  include ElasticMapper

  BETA_EMAILS = ["sdemjanenko@gmail.com", "etienne.lebel@gmail.com", "bencoe@gmail.com", "battista.christian@gmail.com"]

  # when a user logs in using OAuth, we create an account
  # with this fake password. It is important that a user
  # not be allowed to login with this password.
  PLACEHOLDER_PASSWORD = 'f662c13e-0a4d-11e4-a0d0-b2227cce2b54'

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :replications, :class_name => 'Replication', :foreign_key => :owner_id
  has_many :articles, :class_name => 'Article', :foreign_key => :owner_id
  has_many :studies, :class_name => 'Study', :foreign_key => :owner_id
  has_many :findings, :class_name => 'Finding', :foreign_key => :owner_id
  has_many :accounts

  validates_uniqueness_of :email
  validates_presence_of :email
  validates :email, inclusion: { in: BETA_EMAILS, message: "%{value} is not in the beta." }

  mapping :email, :name, :index => :not_analyzed

  after_save :index
  after_destroy :delete_from_index

  # TODO: make login disabled until
  # a user creates a login for their account.
  def active_for_authentication?
    super && false
  end

  def self.create_with_omniauth(auth)
    email = auth.info.email
    user = User.find_by_email(email)

    # if no user is associated with this
    # email address create one.
    unless user
      user = User.create({
        name: auth["info"]["name"],
        email: email,
        password: PLACEHOLDER_PASSWORD,
        password_confirmation: PLACEHOLDER_PASSWORD
      })
    end

    # now add the account to the user!
    user.accounts.create({
      provider: auth["provider"],
      uid: auth["uid"]
    })

    user
  end
end
