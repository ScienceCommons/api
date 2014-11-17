class UserBookmark < ActiveRecord::Base
  belongs_to :user
  belongs_to :bookmarkable, :polymorphic => true

  def as_json(opts={})
    super(opts).tap do |h|
      h['bookmarkable'] = self.bookmarkable if opts[:bookmarkable]
    end
  end
end
