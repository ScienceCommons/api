class UserBookmark < ActiveRecord::Base
  belongs_to :user
  belongs_to :bookmarkable, :polymorphic => true
end
