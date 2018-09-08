#!/usr/bin/env bash
# It will generally take about 40 seconds for elasticsearch and couchdb to be ready to receive connections
echo 'Scheduling setup scripts to run in 40 seconds...'
sleep 40
/usr/src/app/conf/initcouch.sh  2>&1 && /usr/src/app/utils/elasticsearch.sh couchadmin test 2>&1

npm start
