class User < ActiveRecord::Base

  include ElasticMapper

  has_many :replications, :class_name => 'Replication', :foreign_key => :owner_id
  has_many :articles, :class_name => 'Article', :foreign_key => :owner_id
  has_many :studies, :class_name => 'Study', :foreign_key => :owner_id
  has_many :findings, :class_name => 'Finding', :foreign_key => :owner_id
  has_many :invites, :class_name => 'Invite', :foreign_key => :inviter_id
  has_many :accounts
  has_one :author
  has_many :submmited_changes, :class_name => 'ModelUpdate', :foreign_key => :submitter_id
  has_many :approved_changes, :class_name => 'ModelUpdate', :foreign_key => :approver_id
  has_many :bookmarks, :class_name => "UserBookmark", dependent: :destroy

  validates_uniqueness_of :email
  validates_presence_of :email

  mapping :email, :name, :index => :not_analyzed

  after_save :index
  after_destroy :delete_from_index

  def self.create_with_omniauth(auth)
    email = auth.info.email

    user = User.find_by_email(email)

    # if no user is associated with this
    # email address create one.
    unless user
      # only allow invited users to create accounts.
      raise Exceptions::NotOnInviteList.new unless Invite.find_by_email(email)

      user = User.create({
        name: auth["info"]["name"],
        email: email
      })
    end

    # now add the account to the user!
    user.accounts.create({
      provider: auth["provider"],
      uid: auth["uid"]
    })

    user
  end

  def send_invite(email)
    if self.admin || self.invite_count > 0
      self.update_attribute(:invite_count, self.invite_count - 1) unless self.admin
      invite = self.invites.create(email: email)
      invite.send_invite
      return invite
    else
      raise Exceptions::NoInvitesAvailable.new
    end
  end

  def can_curate?
    true
  end
end
