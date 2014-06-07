class StudiesController < ApplicationController
  #before_action :authenticate_user!
  #before_filter :authenticate!

  def index
    raise 'article_id must be provided' if params[:article_id].nil?
    article_id = params[:article_id].to_i
    render json: Article.find(article_id).studies
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def show
    id = params[:id] ? params[:id].to_i : -1

    # allow a study to be looked up by either /article/id/study/id
    # or /study/id.
    if params[:article_id]
      article_id = params[:article_id] ? params[:article_id].to_i : -1

      render json: Article.find(article_id).studies.find(id)
        .as_json(findings: true)
    else
      render json: Study.find(id)
        .as_json(findings: true)
    end
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def create
    raise 'article_id must be provided' if params[:article_id].nil?
    study = Article.find(params[:article_id].to_i).studies.create!({
      n: params['n'] ? params['n'].to_i : nil,
      power: params['power'] ? params['power'].to_f : nil
    })

    update_serialized_keys(study)

    study.save! if study.changed?
    render json: study
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  def update
    raise 'article_id must be provided' if params[:article_id].nil?
    id = params[:id].to_i
    article_id = params[:article_id].to_i
    study = Article.find(article_id).studies.find(id)

    # don't use the update method, since we
    # update effecgt_size and variables as well.
    study.n = params[:n] if params[:n]
    study.power = params[:power] if params[:power]
    update_serialized_keys(study)

    study.save! if study.changed?
    render json: study
  rescue StandardError => ex
    render json: {error: ex.to_s}, status: 500
  end

  # variables and effect_size are special
  # snowflakes which are serialized, this
  # helper simplifies updating these keys
  # in :update and :create.
  def update_serialized_keys(study)
    # push dependent and independent variables.
    [:dependent_variables, :independent_variables].each do |key|
      params[key].to_a.each do |v|
        study.send("#{key}=".to_sym, [])
        study.send("add_#{key}".to_sym, v)
      end
    end

    # set effect size for a specific test type.
    if params[:effect_size]
      key, value = params[:effect_size].each_pair.first
      study.set_effect_size(key, value.to_f)
    end
  end
  private :update_serialized_keys

  def destroy
    raise 'article_id must be provided' if params[:article_id].nil?

    id = params[:id].to_i
    article_id = params[:article_id].to_i
    study = Article.find(article_id).studies.find(id)

    render(json: {error: 'you can only delete studies that you create'}, status: 401) and return unless (current_user == study.owner) or study.owner.nil?

    study.destroy!

    render json: study.as_json(findings: true)
  rescue ActiveRecord::RecordNotFound => ex
    render json: {error: ex.to_s}, status: 404
  rescue StandardError => ex
    p ex
    render json: {error: ex.to_s}, status: 500
  end
end
