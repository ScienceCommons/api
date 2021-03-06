# CurateScience API Server
[![Travis](https://travis-ci.org/ScienceCommons/api.svg?branch=master)](https://travis-ci.org/ScienceCommons/api.svg?branch=master)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/ScienceCommons/api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Dependencies:
* ruby-2.0.0
* Java >=1.6
* postgresql >=9.3
* elasticsearch
* postgresql
* a C compiler toolchain for your platform (e.g. on Mac, xcode developer tools) so you can build nokogiri

### OAuth2
The app uses Google OAuth2 for authentication. In order to authenticate with a local instance of the server you need to set up OAuth2 credentials and register your callback URI at [Google Developer Console](https://console.developers.google.com/), and export your credentials to your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.

### How to build and run:
* see setup_ubuntu.sh for commands needed to install dependencies and set up the app on an Ubuntu Linux machine.

* Download and install dependencies
```bash
bundle install
```

* Database initialization

First, create the database
```bash
psql -c 'create database science_commons_development' -U postgres
```
Then, migrate the database schema:
```bash
bundle exec rake db:migrate
```
Next, fill in your e-mail address in the Invite and User seeds in db/seeds.rb so that you can authenticate:
```ruby
User.create!([
  {email: "your_name@gmail.com", remember_created_at: nil, sign_in_count: 0, current_sign_in_at: nil, last_sign_in_at: nil, current_sign_in_ip: nil, last_sign_in_ip: nil, admin: true, curator: nil, name: "Your Name Here", invite_count: 100}
             ])

Invite.create!([
  {invite_id: nil, inviter_id: 1, email: "your_name@gmail.com"}
])
```
Then, run the seed task to populate your dev database with test data:
```bash
bundle exec rake db:seed
```

* How to run the test suite

```bash
bundle exec rspec
```

* Environment Variables
```bash
export TEST_MAIN_JS=(location of the main.js file built by the www app, e.g. ../www/build/production/public/assets/main.js)
export DEV_API_ROOT=http://localhost:5000/
export ELASTIC_SEARCH_URL=http://127.0.0.1:9200
export GOOGLE_CLIENT_ID=(your google client id)
export GOOGLE_CLIENT_SECRET=(your google client secret)
```

* Services (job queues, cache servers, search engines, etc.)

```bash
bundle install
bundle exec rails s -b localhost -p 5000
elasticsearch
```
Visit /login or /beta to log in with Google OAuth2.
