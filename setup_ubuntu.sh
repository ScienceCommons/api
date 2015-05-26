#!/usr/bin/env bash

#assuming you have curl and git installed already

#install ruby via RVM (ruby version manager)
curl -sSL https://get.rvm.io | bash -s $1
source /usr/local/rvm/scripts/rvm
rvm install ruby-2.0.0
rvm use ruby-2.0.0

#install Java Runtime environment, required for elasticsearch
sudo apt-get install -y openjdk-6-jre

#install ElasticSearch
wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.7.deb
dpkg -i elasticsearch-0.90.7.deb

#install postgresql
sudo apt-get install -y postgresql postgresql-contrib

#create database
sudo -u postgres bash -c "psql -c \"CREATE DATABASE science_commons_development;\""

#install gems
bundle install

#migrate database
rake db:migrate

#seed database
rake db:seed

#launch app
rails s -b localhost -p 5000
