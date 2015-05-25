#!/usr/bin/env bash
#assumes you have curl and git installed already
curl -sSL https://get.rvm.io | bash -s $1
source /usr/local/rvm/scripts/rvm
rvm install ruby-2.0.0
rvm use ruby-2.0.0
