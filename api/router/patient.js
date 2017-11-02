var router = require('express').Router();

// Pats controller
var patientsController = require('../controllers/patients_controller.js');


router.get('/', patientsController.root);
router.get('/root', patientsController.notroot);

module.exports = router;
