var config =  require('../config.js');
var nano = require('nano')(config.couchAuthDbURL);
var maindb = nano.use('main');
var relPouch = require('relational-pouch');
var patientsToCheck;

relPouch.setSchema([]);
maindb.view('patient_by_admission', 'patient_by_admission', function(err, body) {
  if (err) {
    console.log('Error getting patient_by_admission:', JSON.stringify(err, null, 2));
  } else {
    patientsToCheck = body.rows.map(function(row) {
      return row.id;
    });
    checkForAdmission(patientsToCheck.shift());
  }
});

function checkForAdmission(patientId) {
  if (patientId) {
    var maxValue = '\uffff';
    var parsedPatientId = relPouch.rel.parseDocID(patientId);
    var options =  {
      include_docs: true,
      startkey: [parsedPatientId.id, null, null, null, 'visit_2_'],
      endkey: [parsedPatientId.id, maxValue, maxValue, maxValue, maxValue]
    };
    maindb.view('visit_by_patient', 'visit_by_patient', options, function(err, body) {
      if (err) {
        console.log('Error getting visit_by_patient:' + parsedPatientId.id, JSON.stringify(err, null, 2));
      } else {
        var haveAdmission = false;
        body.rows.forEach(function(visit) {
          if (visit.doc.data.status) {
            if (visit.doc.data.status === 'Admitted') {
              haveAdmission = true;
            }
          }
        });
        if (!haveAdmission) {
          maindb.get(patientId, function(err, body) {
            if (err) {
              console.log('Could not get ' + patientId + ' to update: ' + JSON.stringify(err, null, 2));
            } else {
              body.data.admitted = false;
              maindb.insert(body, function(err) {
                if (err) {
                  console.log('Could not update ' + patientId + JSON.stringify(err, null, 2));
                } else {
                  console.log('Updated patient to discharged:' + patientId);
                  checkForAdmission(patientsToCheck.shift());
                }
              });
            }
          });
        } else {
          checkForAdmission(patientsToCheck.shift());
        }
      }
    });
  } else {
    console.log('Done');
  }
}
