var config =  require('../config.js');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var uuid = require('node-uuid');
var recordsToUpdate = [];

maindb.list({startkey: 'visit_', endkey: 'visit_\uffff', include_docs: true}, function(err, results) {
  if (!err) {
    results.rows.forEach(function(result) {
      var visitDoc = result.doc.data;
      if (visitDoc !== null && visitDoc.notes && !visitDoc.patientNotes) {
        var noteUuid = uuid.v4();
        var visitId = result.doc._id.substr(8);
        var patientNote = {
          _id: 'patientNote_2_' + noteUuid,
          data: {
            content: visitDoc.notes,
            createdBy: visitDoc.examiner || '',
            date: visitDoc.startDate,
            noteType: 'General',
            patient: visitDoc.patient,
            visit: visitId
          }
        };
        recordsToUpdate.push(patientNote);
        result.doc.data.patientNotes = [noteUuid];
        recordsToUpdate.push(result.doc);
      }
    });
    if (recordsToUpdate.length > 0) {
      maindb.bulk({ docs: recordsToUpdate}, function(err, results) {
        if (err) {
          console.log('Error updating patient notes records.', err);
        } else {
          console.log('Success updating patient notes records.', JSON.stringify(results, null, 2));
        }
      });
    }
  } else {
    console.log('ERROR fetching visit records', err);
  }
});
