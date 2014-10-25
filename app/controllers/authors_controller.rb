class AuthorsController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

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
    render json: {error: ex.to_s}, status: 500
  end

  def show
    render json: Author.find(params[:id].to_i)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def create
    author = Author.new({
      owner_id: current_user ? current_user.id : nil
    })
    author.update_attributes!(params.slice(*UPDATEABLE_ATTRS))

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: author, status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def update
    author = Author.find(params[:id].to_i)

    # you can only edit articles you have created.
    render(json: {error: 'you can only edit authors that you create'}, status: 401) and return unless current_user == author.owner || current_user.admin
    author.update_attributes!(params.slice(*UPDATEABLE_ATTRS))

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: author
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end

  def destroy
    author = Author.find(params[:id].to_i)

    # you can only edit articles you have created.
    render(json: {error: 'you can only delete authors that you create'}, status: 401) and return unless current_user == author.owner || current_user.admin

    author.destroy!

    # force index to update, so that we
    # can immediately query the update.
    ElasticMapper.index.refresh

    render json: {success: true, data: author}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: 'unknown error'}, status: 500
  end
end
