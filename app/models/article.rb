class Article < ActiveRecord::Base

  include ElasticMapper

  has_many :studies, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  belongs_to :owner, :class_name => 'User', :foreign_key => :owner_id
  has_many :article_authors, dependent: :destroy, autosave: true
  has_many :authors, -> {order 'article_authors.number ASC'}, :through => :article_authors
  has_many :model_updates, as: :changeable, dependent: :destroy
  has_many :bookmarks, class_name: "UserBookmark", as: :bookmarkable, dependent: :destroy
  belongs_to :updater, :class_name => 'User', :foreign_key => :updater_id

  validates_uniqueness_of :doi, unless: "doi.blank?"
  validates_presence_of :title

  serialize :authors_denormalized

  mapping :title, :doi, :index => :not_analyzed
  mapping :title, :abstract, :authors_for_index, :journal_title, :tags
  mapping :publication_date, :type => :date

  after_save :index
  after_destroy :delete_from_index

  before_validation do
    sanitizer = Rails::Html::WhiteListSanitizer.new
    self.abstract = sanitizer.sanitize(self.abstract, tags: %w(a br), attributes: %w(href target))
  end

  before_save do
    self.doi = nil if self.doi.blank?
  end

  before_create do
    self.authors_denormalized = []
  end

  def add_author(first_name, middle_name, last_name)
    authors_denormalized.push(
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name
    )
    self
  end

  def authors_for_index
    indexable_authors = self.authors_denormalized
    if self.authors.count > 0
      indexable_authors = self.authors
    end
    indexable_authors.map do |a|
      "#{a[:first_name]} #{a[:middle_name]} #{a[:last_name]}"
    end.join(' ')
  end

  def as_json(opts={})
    super(opts).tap do |h|
      h['authors'] = self.authors if opts[:authors]
      h['updater_name'] = self.try(:updater).try(:name)
      h['updater_author_id'] = self.try(:updater).try(:author).try(:id)
    end
  end

  def descendant_comments
    Comment.where(primary_commentable_id: self.id, primary_commentable_type: "Article")
  end

  def find_doi(doi)
    biblio_for(doi)
  end

  def biblio_for(doi)
    require 'rubygems'
    require 'open-uri'
    doc = Nokogiri::XML(open("http://www.crossref.org/openurl/?id=doi:#{doi}&noredirect=true&pid=etienne.lebel@gmail.com&format=unixref"))
    if (doc/"doi_record").present? && (doc/"error").blank?
      journal = (doc/"abbrev_title").inner_html
      abstract = (doc/"abstract").inner_html
      journal_issn = (doc/'issn[media_type="electronic"]').inner_html
      year = (doc/"journal_issue/publication_date/year").present? ? (doc/"journal_issue/publication_date/year").first.inner_html : Date.today.year.to_s
      month = (doc/"journal_issue/publication_date/month").present? ? (doc/"journal_issue/publication_date/month").first.inner_html : "01"
      day = (doc/"journal_issue/publication_date/day").present? ? (doc/"journal_issue/publication_date/day").first.inner_html : "01"
      date = (day + "." + month +"." + year).to_date
      title = (doc/"title").inner_html
      authors_count = (doc/"person_name").count
      self.doi = doi
      self.title = title
      self.journal_title = journal
      self.journal_issn = journal_issn
      self.publication_date = date
      self.abstract = abstract
      for i in 0...authors_count
        given_name = (doc/"given_name")[i].inner_html.split(" ")
        first_name = given_name[0]
        middle_name = given_name[1]
        last_name = (doc/"surname")[i].inner_html if (doc/"surname")[i].present?
        author = Author.new(first_name: first_name, middle_name: middle_name, last_name: last_name)
        self.authors << author
      end
      self
    else
      nil
    end
  end

  def last_model_update
    ModelUpdate.where(changeable_id: self.id, changeable_type: "Article").last
  end

  def badges
    studies = self.studies
    studies.flat_map do |study|
      study.links.map{|l| l.type}
    end
  end
end
