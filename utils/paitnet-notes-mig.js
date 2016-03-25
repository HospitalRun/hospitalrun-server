var config =  require('../config.js'),
    nano = require('nano')(config.couchAuthDbURL),
    maindb = nano.use('main'),
    userdb = nano.use('user'),
    uuid = require('node-uuid');

function updateRecord(record, callback) {
  var updateParams = record._id;
  maindb.insert(record, updateParams, function(err, body) {
    if (err) {
      callback(err);
    } else {
      record._id = body.id;
      record._rev = body.rev;
      callback(null, record);
    }
  });
}

maindb.list({startkey:'visit_', endkey:'visit_\uffff', include_docs: true}, function(err, results) {
  console.log("start");
  if (!err) {
    results.rows.forEach(function(result) {
      var visitDoc = result.doc.data;
      if (visitDoc !== null && visitDoc.notes !== null && visitDoc.patientNotes === null) {
        var patientNote = {
          _id: 'patientNote_2_'+ uuid.v4(),
          content: visitDoc.notes,
          createdBy: 'system',
          date: new Date(),
          noteType: 'General',
          patient: visitDoc.patient,
          visit: visitDoc._id
        };
        updateRecord(patientNote, function(error, result) {
          if (error !== null) {
            console.log("error");
            console.dir(error);
          } else {
            visitDoc.patientNotes = [ patientNote._id ];
            updateRecord(visitDoc, function() {
              console.log("sucess");
              console.log("added: " + result._id + " to " + visitDoc._id);
            });
          }
        });
      }
    });
    console.log("end loop");
  } else {
    console.log("ERROR fetching visit records", err);
  }
});