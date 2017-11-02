var router = require('express').Router();

var questionairreController = require('../controllers/questionairre_controller.js');


router.get('/', questionairreController.root);
router.get('/root', questionairreController.notroot);

module.exports = router;

