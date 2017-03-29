#!/bin/bash
if [ -z "${1}" ] || [ -z "${2}" ]; then
    echo "Usage: ./elasticsearch.sh <couchuser> <couchpassword>"
    exit
fi

echo "Setting up mappings"
curl --user elastic:changeme -XPUT 'elasticsearch:9200/hrdb' -d' {
    "mappings": {
        "_default_": {
            "date_detection": false,
            "properties" : {
                "data.crossReference": {
                    "type" : "text"
                },
                "data.description": {
                    "type" : "text"
                },
                "data.externalInvoiceNumber": {
                    "type" : "text"
                },
                "data.externalPatientId": {
                    "type" : "text"
                },
                "data.firstName": {
                    "type" : "text"
                },
                "data.friendlyId": {
                    "type" : "text"
                },
                "data.lastName": {
                    "type" : "text"
                },
                "data.name": {
                    "type" : "text"
                },
                "data.phone": {
                    "type" : "text"
                },
                "data.patientInfo": {
                    "type" : "text"
                },
                "data.prescription": {
                    "type" : "text"
                }
            }
        }
    }
 }'