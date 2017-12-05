const db      = require('../modules/db.js');
const adapter = require('../adapter/questionnaire_response.js');
const config  = require('../config.js');

exports.index = (request, response) => {
  db.index('questionnaireResponse').then(questionnaireResponses => {
    return response.status(200).json(questionnaireResponses.map(p => adapter('couch', p)));
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.show = (request, response) => {
  db.show(request.params.questionnaireResponseId)
  .then(questionnaireResponse => {
    return response.status(200).json(adapter('couch', questionnaireResponse));
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `QuestionnaireReponse ${request.params.questionnaireResponseId} not found` });
    }
    return config.error(response, error);
  });
}

exports.create = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.create('questionnaireResponse', convertedData).then(questionnaireResponse => {
    db.audit(questionnaireResponse.id, request.body).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(201).json({ message: 'Created', data: adapter('couch', questionnaireResponse) });
  }).catch(error => {
    return config.error(response, error);
  });
};

exports.update = (request, response) => {
  let convertedData = adapter('fhir', request.body);
  db.update(request.params.questionnaireResponseId, convertedData)
  .then(questionnaireResponse => {
    db.audit(questionnaireResponse.id, convertedData).catch(error => config.log({ error, message: 'Could not updated fhir audit document' }));
    return response.status(200).json({ message: 'Updated', data: adapter('couch', questionnaireResponse) });
  }).catch(error => {
    if (error && error.message === 'missing') {
      return response.status(404).json({ message: `QuestionnaireReponse ${request.params.questionnaireResponseId} not found` });
    }
    return config.error(response, error);
  });
}
