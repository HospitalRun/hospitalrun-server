const router = require('express').Router();

const controller = require('../controllers/questionnaires_controller');

router.get('/',                  controller.index);
router.post('/',                 controller.create)
router.get('/:questionnaireId',  controller.show);
router.put('/:questionnaireId',  controller.update);

module.exports = router;

