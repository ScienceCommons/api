class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :replications, :class_name => 'Replication', :foreign_key => :owner_id
  has_many :articles, :class_name => 'Article', :foreign_key => :owner_id
  has_many :studies, :class_name => 'Study', :foreign_key => :owner_id
  has_many :findings, :class_name => 'Finding', :foreign_key => :owner_id
end
