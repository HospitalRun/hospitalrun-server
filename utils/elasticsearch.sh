curl -XPUT 'localhost:9200/_river/hrdb/_meta' -d '{
    "type" : "couchdb",
    "couchdb" : {
        "host" : "localhost",
        "port" : 5984,
        "db" : "main",
        "filter" : null,
        "user" : "hradmin",
        "password" : "test",
        "ignore_attachments": true,
        "script_type": "js",
        "script": "var uidx = ctx.doc._id.indexOf(\"_\"); if (ctx.doc._id && (uidx = ctx.doc._id.indexOf(\"_\")) > 0) {ctx._type = ctx.doc._id.substring(0, uidx);} var fieldsToKeep = [];switch(ctx._type) { case \"inventory\": { fieldsToKeep = [\"crossReference\",\"description\",\"friendlyId\",\"name\"]; break;} case \"invoice\" : { fieldsToKeep = [\"patientInfo\", \"externalInvoiceNumber\"];break;} case \"patient\" : { fieldsToKeep = [\"externalPatientId\",\"firstName\",\"friendlyId\",\"lastName\"]; break; } case \"pricing\" : { fieldsToKeep = [\"name\"]; break; } default: { ctx.ignore = true;}}"
    },
    "index" : {
        "index" : "hrdb",
        "type" : "hrdb",
        "bulk_size" : "100",
        "bulk_timeout" : "10ms"
    }
}'
