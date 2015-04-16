# CurateScience
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/ScienceCommons/api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Dependencies:
* ruby-2.0.0
* Java >=1.6
* elasticsearch
* postgresql
* a C compiler for your platform so you can build nokogiri

## How to build and run:

* Database initialization

```bash
bundle exec rake db:migrate
```

* How to run the test suite

```bash
bundle exec rspec
```

* Services (job queues, cache servers, search engines, etc.)

```bash
bundle install
bundle exec rails s
```
