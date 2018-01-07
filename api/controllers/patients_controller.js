const db      = require('../modules/db.js');
const adapter = require('../adapter/patient.js');
const config  = require('../config.js');

exports.index = (request, response) => {
  db.index('patient').then(patients => {
    return response.status(200).json(patients.map(p => adapter('couch', p)));
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.show = (request, response) => {
  db.show(request.params.patientId, 'patient_by_display_id', 'patient_by_display_id')
  .then(patient => {
    return response.status(200).json(adapter('couch', patient));
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `Patient ${request.params.patientId} not found` });
    }
    return config.error(response, error);
  });
}

exports.create = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.create('patient', convertedData).then(patient => {
    db.audit(patient.id, request.body).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(201).json({ message: 'Created', data: adapter('couch', patient) });
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.update = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.update(request.params.patientId, convertedData)
  .then(patient => {
    db.audit(patient.id, convertedData).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(200).json({ message: 'Updated', data: adapter('couch', patient) });
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `Patient ${request.params.patientId} not found` });
    }
    return config.error(response, error);
  });
}
