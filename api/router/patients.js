var router = require('express').Router();

// Pats controller
var patientsController = require('../controllers/patients_controller.js');


router.get('/', patientsController.root);
router.get('/root', patientsController.notroot);
// // Home page route
// router.get('/', function (req, res) {
//   res.send('Wiki home page');
// })

// // About page route
// router.get('/about', function (req, res) {
//   res.send('About this wiki');
// })

module.exports = router;
// var patients = require('../controllers/patients_controller.js');

// router.get('/', (r, q) => q.send(200));
// router.get('/:patId', patients.show);
