#!/bin/bash
if [ -z "${1}" ] || [ -z "${2}" ]; then
    echo "Usage: ./elasticsearch.sh <couchuser> <couchpassword>"
    exit
fi

echo "Setting up mappings"
curl -XPUT 'localhost:9200/hrdb' -d' {
    "mappings": {
        "_default_": {        
            "date_detection": false,
            "properties" : {
                "crossReference": {
                    "type" : "string"
                },
                "description": {
                    "type" : "string"
                },
                "externalInvoiceNumber": {
                    "type" : "string"
                },
                "externalPatientId": {
                    "type" : "string"                
                },
                "firstName": {
                    "type" : "string"
                },                
                "friendlyId": {
                    "type" : "string"
                },
                "lastName": {
                    "type" : "string"
                },
                "name": {
                    "type" : "string"
                },
                "patientInfo": {
                    "type" : "string"
                },
                "prescription": {
                    "type" : "string"
                }
            }
        }        
    }
 }'
echo "Setting up couchdb river" 
curl -XPUT 'localhost:9200/_river/hrdb/_meta' -d '{
    "type" : "couchdb",
    "couchdb" : {
        "host" : "localhost",
        "port" : 5984,
        "db" : "main",
        "filter" : null,
        "user" : $1,
        "password" : $2,
        "ignore_attachments": true,
        "script_type": "js",
        "script": "var uidx = ctx.doc._id.indexOf(\"_\");if (ctx.doc._id && (uidx = ctx.doc._id.indexOf(\"_\")) > 0) {    ctx._type = ctx.doc._id.substring(0, uidx);} var fieldsToKeep = [];switch(ctx._type) {     case \"inventory\": {        fieldsToKeep = [\"crossReference\",\"description\",\"friendlyId\",\"name\"];                break;    }     case \"invoice\" : {         fieldsToKeep = [\"patientInfo\", \"externalInvoiceNumber\"];        break;    }    case \"patient\" : {         fieldsToKeep = [\"externalPatientId\",\"firstName\",\"friendlyId\",\"lastName\"];        break;    }     case \"pricing\" : {        fieldsToKeep = [\"name\"];                    break;    }     default: { ctx.ignore = true; }}"
    },
    "index" : {
        "index" : "hrdb",
        "type" : "hrdb",
        "bulk_size" : "100",
        "bulk_timeout" : "10ms"
    }
}'
echo "Done"