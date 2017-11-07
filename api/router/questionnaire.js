const router = require('express').Router();

const questionnaireController = require('../controllers/questionnaire_controller.js');

router.get('/', questionnaireController.index);
router.post('/', questionnaireController.create)

module.exports = router;

