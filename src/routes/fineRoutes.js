const { Router } = require('express');
const fineController = require('../controllers/fineController');
const router = Router();

router.get('/', fineController.renderViewFines);
router.get('/add', fineController.renderViewCreateFine);
router.post('/add', fineController.handlerCreateFine);
router.get('/mark-as-paid/:id', fineController.handlerMarkAsPaidFine);

module.exports = router;