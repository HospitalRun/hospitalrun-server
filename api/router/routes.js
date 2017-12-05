const router    = require('express').Router();
const apiConfig = require('../config.js');

router.use((request, response, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(request.method, request.originalUrl, JSON.stringify(request.body));
  }
  apiConfig.log({ path: `${request.method} ${request.originalUrl}`, params: request.body });
  next();
});

router.use('/patients',               require('./patients'));
router.use('/questionnaires',         require('./questionnaires'));
router.use('/questionnaireResponses', require('./questionnaire_responses'));

router.use((error, request, response, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.trace(error);
  }
  apiConfig.log({ error, path: `${request.method} ${request.originalUrl}`, params: request.body });
  if (!response.headerSent) {
    response.status(500).json({ error: 'Internal server error' });
  }
  next();
});

module.exports = router;
