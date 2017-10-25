var router = require('express').Router();

// patients sub route
var patientsRouter = require('./patients');

router.use((request, response, next) => {
  console.log(request.method, request.originalUrl, request.body);
  next();
});

// when pats, pats sub root
router.use('/patients', patientsRouter);

module.exports = router;
