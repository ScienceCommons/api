class AdminController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  before_filter :check_admin

  def db_stats
    stats = {
      :articles => get_stats(Article),
      :authors => get_stats(Author),
      :bookmarks => get_stats(UserBookmark),
      :comments => get_stats(Comment),
      :feedback_messages => get_stats(FeedbackMessage),
      :invites => get_stats(Invite),
      :links => get_stats(Link),
      :model_updates => get_stats(ModelUpdate),
      :replications => get_stats(Replication),
      :studies => get_stats(Study),
      :users => get_stats(User)
    }

    render json: stats
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  private

  def get_stats(model)
    {
      :total => model.count,
      :last_day => {
        :created => model.where("created_at > ?", 1.day.ago).count,
        :updated => model.where("updated_at > ?", 1.day.ago).count
      }
    }
  end
end
