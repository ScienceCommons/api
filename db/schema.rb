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

  create_table "access_tokens", force: true do |t|
    t.integer  "account_id"
    t.integer  "client_id"
    t.integer  "refresh_token_id"
    t.string   "token"
    t.datetime "expires_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "accounts", force: true do |t|
    t.string   "username"
    t.string   "password"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "articles", force: true do |t|
    t.string   "doi",                            null: false
    t.integer  "journal_id"
    t.date     "publication_date"
    t.string   "abstract"
    t.float    "repeatability",    default: 0.0
    t.float    "materials",        default: 0.0
    t.float    "quality_of_stats", default: 0.0
    t.float    "disclosure",       default: 0.0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "articles", ["doi"], name: "index_articles_on_doi", unique: true, using: :btree
  add_index "articles", ["journal_id"], name: "index_articles_on_journal_id", using: :btree
  add_index "articles", ["publication_date"], name: "index_articles_on_publication_date", using: :btree

  create_table "auth_facebooks", force: true do |t|
    t.integer  "account_id"
    t.string   "identifier",   limit: 20
    t.string   "access_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "authorization_codes", force: true do |t|
    t.integer  "account_id"
    t.integer  "client_id"
    t.string   "token"
    t.string   "redirect_uri"
    t.datetime "expires_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "clients", force: true do |t|
    t.integer  "account_id"
    t.string   "identifier"
    t.string   "secret"
    t.string   "name"
    t.string   "website"
    t.string   "redirect_uri"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "protected_resources", force: true do |t|
    t.integer  "account_id"
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "refresh_tokens", force: true do |t|
    t.integer  "account_id"
    t.integer  "client_id"
    t.string   "token"
    t.datetime "expires_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
