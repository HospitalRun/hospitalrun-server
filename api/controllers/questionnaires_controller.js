const db      = require('../modules/db.js');
const adapter = require('../adapter/questionnaire.js');
const config  = require('../config.js');

exports.index = (request, response) => {
  db.index('questionnaire').then(questionnaires => {
    return response.status(200).json(questionnaires.map(p => adapter('couch', p)));
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.show = (request, response) => {
  db.show(request.params.questionnaireId)
  .then(questionnaire => {
    return response.status(200).json(adapter('couch', questionnaire));
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `Questionnaire ${request.params.questionnaireId} not found` });
    }
    return config.error(response, error);
  });
}

exports.create = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.create('questionnaire', convertedData).then(questionnaire => {
    db.audit(questionnaire.id, request.body).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(201).json({ message: 'Created', data: adapter('couch', questionnaire) });
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.update = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.update(request.params.questionnaireId, convertedData)
  .then(questionnaire => {
    db.audit(questionnaire.id, convertedData).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(200).json({ message: 'Updated', data: questionnaire })
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `Questionnaire ${request.params.questionnaireId} not found` });
    }
    return config.error(response, error);
  });
}
