class AuthorsController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  before_filter :check_can_curate, :only => [:create, :update, :mark_duplicate, :destroy]

  UPDATEABLE_ATTRS = [
    :first_name,
    :middle_name,
    :last_name,
    :orcid,
    :job_title,
    :affiliations
  ]

  def index
    opts = {
      from: params[:from] ? params[:from].to_i : 0,
      size: params[:size] ? params[:size].to_i : 20
    }

    render json: Author.search(params[:q] || '*', opts)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Author.find(params[:id].to_i).as_json(:articles => params[:include] && params[:include].include?("articles"))
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def create
    author = nil
    ActiveRecord::Base.transaction do
      author = Author.create!({
        owner_id: current_user ? current_user.id : nil
      }.merge(params.slice(*UPDATEABLE_ATTRS)))
      author.model_updates.create!(:submitter => current_user, :model_changes => author.changes, :operation => :model_created)
    end

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: author, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def update
    author = Author.find(params[:id].to_i)

    ActiveRecord::Base.transaction do
      author.attributes = params.slice(*UPDATEABLE_ATTRS)
      if author.changed?
        author.model_updates.create!(:submitter => current_user, :model_changes => author.changes, :operation => :model_updated)
      end
      author.save!
    end

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: author
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def mark_duplicate
    author = Author.find(params[:id].to_i)
    primary_author = Author.find(params[:same_as_id].to_i)

    ActiveRecord::Base.transaction do
      author.primary_author = primary_author
      if author.changed?
        author.model_updates.create!(:submitter => current_user, :model_changes => author.changes, :operation => :model_updated)
      end
      author.save!
    end

    render json: author
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end

  def destroy
    author = Author.find(params[:id].to_i)
    author.destroy!

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: {success: true, data: author}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: 'unknown error'}, status: 500
  end
end
