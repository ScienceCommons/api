class StudiesController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    return render_error('article_id must be provided') if params[:article_id].nil?
    article_id = params[:article_id].to_i
    render json: Article.find(article_id).studies.map{|s| s.as_json(:replications => params[:replications], :links => true)}
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
          replications: params[:replications],
          links: true
        )
    else
      render json: Study.find(id)
        .as_json(
          findings: true,
          materials: true,
          registrations: true,
          replications: params[:replications],
          links: true
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
    study = Article.find(params[:article_id].to_i).studies.create!({
      n: params['n'] ? params['n'].to_i : nil,
      power: params['power'] ? params['power'].to_f : nil,
      number: params['number'].to_s,
    })

    update_serialized_keys(study)

    if params[:links]
      ids = params[:links].map{|link| id = link["id"].to_i; id > 0 ? id : nil}.compact
      study.links = Link.find(ids)
      params[:links].each do |link|
        study.links << Link.new(link) if link["id"].nil?
      end
    end

    study.save!
    render json: study.as_json(:links => true), status: 201
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

    if article_id != -1
      study = Article.find(article_id).studies.find(id)
    else
      study = Study.find(id)
    end

    # don't use the update method, since we
    # update effect_size and variables as well.
    study.n = params[:n] if params[:n]
    study.power = params[:power] if params[:power]
    update_serialized_keys(study)
    study.number = params[:number] if params[:number]

    if params[:links]
      ids = params[:links].map{|link| id = link["id"].to_i; id > 0 ? id : nil}.compact
      study.links = Link.find(ids)
      params[:links].each do |link|
        study.links << Link.new(link) if link["id"].nil?
      end
    end

    study.save!
    render json: study.as_json(:links => true)
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
      study.send("#{key}=".to_sym, params[key].to_a) if !params[key].nil?
    end

    # set effect size for a specific test type.
    if params[:effect_size]
      key, value = params[:effect_size].each_pair.first
      study.set_effect_size(key, value.to_f)
    end
  end
  private :update_serialized_keys

  def destroy
    return render_error('article_id must be provided') if params[:article_id].nil?

    id = params[:id].to_i
    article_id = params[:article_id].to_i
    study = Article.find(article_id).studies.find(id)

    render(json: {error: 'you can only delete studies that you create'}, status: 401) and return unless (current_user == study.owner) or study.owner.nil?

    study.destroy!

    render json: {success: true, data: study}, status: 204
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    Raven.capture_exception(ex)
    render json: {error: "unknown error"}, status: 500
  end
end
