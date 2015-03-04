/* global emit */
var config =  require('../config.js'), 
    nano = require('nano')(config.couch_auth_db_url),
    maindb = nano.use('main');


setupView(function(err) {
    if (err) {
        console.log("Error setting up view:", err);        
    } else {
        processRows(function(err, body) {
            if (err) {
                console.log("Error processing rows:",err);
            } else {
                console.log("Success processing rows:", body);
            }
        });
    }    
});

function processRows(callback) {
    maindb.view('xledger', 'unimported', function(err, body) {
        if (err) {
            callback(err);
        } else {
            var rowCount = 0;
            body.rows.forEach(function(doc) {
                console.log(doc.value);
                rowCount++;
            });
            callback(null, rowCount+' rows processed');
        }
    });    
}


function setupView(callback) {
    maindb.get('_design/xledger', function(err, body) {
        if (!err) {
            callback(null, body);
        } else {        
            var ddoc = {
                views: {
                    unimported: {
                        map: function(doc) {
                            var doctype,  
                                uidx;
                            if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {
                                doctype = doc._id.substring(0, uidx);
                                switch(doctype) {
                                    case 'invoice':
                                    case 'payment':
                                    case 'inv-purchase': 
                                    case 'inv-request': {
                                        if(!doc.exportedToXledger) { 
                                            emit(null, doc); 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            maindb.insert(ddoc, '_design/xledger', callback);
        }
    });
}
