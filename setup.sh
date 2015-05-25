#!/usr/bin/env bash
#assumes you have curl and git installed already
curl -sSL https://get.rvm.io | bash -s $1
source /usr/local/rvm/scripts/rvm
rvm install ruby-2.0.0
rvm use ruby-2.0.0
#install Java Runtime environment, required for elasticsearch
apt-get install openjdk-6-jre
wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.7.deb
dpkg -i elasticsearch-0.90.7.deb
