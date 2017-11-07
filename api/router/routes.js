const router = require('express').Router();
const apiConfig = require('../config.js');

router.use((request, response, next) => {
  console.log(request.method, request.originalUrl, request.body);
  if (Object.keys(request.body).length) {
    apiConfig.flog(request.body);
  }
  next();
});

router.use('/test', (request, response) => {
  return response.status(200).json({ blahbidyblah: 'stringy stringy string string' });
});

router.use('/patient', require('./patient'));
router.use('/questionnaire', require('./questionnaire'));

router.use((error, request, response, next) => {
  console.trace(error);
  if (!response.headerSent) {
    response.status(500).json({ error: 'Internal server error' });
  }
  next();
});

module.exports = router;
