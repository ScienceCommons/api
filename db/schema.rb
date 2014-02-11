# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140204054517) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "articles", force: true do |t|
    t.string   "doi"
    t.integer  "journal_id"
    t.date     "publication_date"
    t.string   "abstract"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "articles", ["doi"], name: "index_articles_on_doi", unique: true, using: :btree
  add_index "articles", ["journal_id"], name: "index_articles_on_journal_id", using: :btree
  add_index "articles", ["publication_date"], name: "index_articles_on_publication_date", using: :btree

end
