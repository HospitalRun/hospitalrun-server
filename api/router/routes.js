var router = require('express').Router();

router.use((request, response, next) => {
  console.log(request.method, request.originalUrl, request.body);
  next();
});

router.use('/patient', require('./patient'));
router.use('/questionairre', require('./questionairre'));

router.use((error, request, response, next) => {
  console.trace(error);
  if (!response.headerSent) {
    response.status(500).json({ error: 'Internal server error' });
  }
  next();
});

module.exports = router;
