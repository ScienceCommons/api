class StudiesController < ApplicationController

  before_filter :check_can_curate, :only => [:create, :update, :destroy]

  def index
    return render_error('article_id must be provided') if params[:article_id].nil?
    article_id = params[:article_id].to_i
    render json: Article.find(article_id).studies.map{|s| s.as_json(:replications => params[:replications], :comments => params[:comments], model_updates: params[:model_updates], replication_of: params[:replication_of])}
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def show
    id = params[:id] ? params[:id].to_i : -1
    article_id = params[:article_id] ? params[:article_id].to_i : -1

    # allow a study to be looked up by either /article/id/study/id
    # or /study/id.
    if article_id != -1

      render json: Article.find(article_id).studies.find(id)
        .as_json(
          findings: true,
          materials: true,
          registrations: true,
          comments: params[:comments],
          model_updates: params[:model_updates],
          replications: params[:replications],
          replication_of: params[:replication_of]
        )
    else
      render json: Study.find(id)
        .as_json(
          findings: true,
          materials: true,
          registrations: true,
          comments: params[:comments],
          model_updates: params[:model_updates],
          replications: params[:replications],
          replication_of: params[:replication_of]
        )
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def create
    return render_error('article_id must be provided') if params[:article_id].nil?
    study = nil
    ActiveRecord::Base.transaction do
      study = Article.find(params[:article_id].to_i).studies.create!({
        n: !params['n'].blank? ? params['n'].to_i : nil,
        power: !params['power'].blank? ? params['power'].to_f : nil,
        number: params['number'].to_s,
        owner: current_user
      })

      update_serialized_keys(study)

      if params[:links]
        ids = params[:links].map{|link| id = link["id"].to_i; id > 0 ? id : nil}.compact
        study.links = Link.find(ids)
        params[:links].each do |link|
          study.links << Link.new(link) if link["id"].nil?
        end
      end

      study.article.update(updater: current_user) if current_user

      study.model_updates.create!(:submitter => current_user, :model_changes => study.changes, :operation => :model_created)
      study.save!
    end

    render json: study.as_json(), status: 201
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue Exceptions::InvalidEffectSize => ex
    render json: {error: ex.to_s}, status: 500
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  def update
    article_id = params[:article_id] ? params[:article_id].to_i : - 1
    id = params[:id] ? params[:id].to_i : -1
    study = nil

    if article_id != -1
      study = Article.find(article_id).studies.find(id)
    else
      study = Study.find(id)
    end

    ActiveRecord::Base.transaction do

      # don't use the update method, since we
      # update effect_size and variables as well.
      study.n = params[:n] if params.has_key?(:n)
      study.power = params[:power] if params.has_key?(:power)
      update_serialized_keys(study)
      study.number = params[:number] if params.has_key?(:number)

      params[:links] ||= [] if params.has_key?(:links)
      if params[:links]
        ids = params[:links].map{|link| id = link["id"].to_i; id > 0 ? id : nil}.compact
        study.links = Link.find(ids)
        params[:links].each do |link|
          if link["id"].nil?
            study.links << Link.new(link) if link["id"].nil?
          else
            study.links.find(link["id"]).update_attributes!(link)
          end
        end
        study.links(true)
      end

      if study.changed?
        study.model_updates.create!(:submitter => current_user, :model_changes => study.changes, :operation => :model_updated)
      end
      study.save!
      study.article.update(updater: current_user) if current_user
    end

    render json: study.as_json()
  rescue ActiveRecord::RecordInvalid => ex
    render_error(ex)
  rescue Exceptions::InvalidEffectSize => ex
    render json: {error: ex.to_s}, status: 500
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end

  # variables and effect_size are special
  # snowflakes which are serialized, this
  # helper simplifies updating these keys
  # in :update and :create.
  def update_serialized_keys(study)
    # push dependent and independent variables.
    [:dependent_variables, :independent_variables].each do |key|
      study.send("#{key}=".to_sym, params[key].to_a) if params.has_key?(key)
    end

    # set effect size for a specific test type.
    if params[:effect_size]
      if params[:effect_size].empty?
        study.effect_size = {}
      else
        key, value = params[:effect_size].each_pair.first
        study.set_effect_size(key, value.to_f)
      end
    end
  end
  private :update_serialized_keys

  def destroy
    return render_error('article_id must be provided') if params[:article_id].nil?

    id = params[:id].to_i
    article_id = params[:article_id].to_i
    study = Article.find(article_id).studies.find(id)
    study.destroy!

    render json: {success: true, data: study}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end
end
