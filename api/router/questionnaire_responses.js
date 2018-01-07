const router = require('express').Router();

const controller = require('../controllers/questionnaire_responses_controller');

router.get('/',                          controller.index);
router.post('/',                         controller.create)
router.get('/:questionnaireResponseId',  controller.show);
router.put('/:questionnaireResponseId',  controller.update);

module.exports = router;

