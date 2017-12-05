const router = require('express').Router();

const controller = require('../controllers/patients_controller');

router.get('/',            controller.index);
router.post('/',           controller.create)
router.get('/:patientId',  controller.show);
router.put('/:patientId',  controller.update);

module.exports = router;
