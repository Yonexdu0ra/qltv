const { Router } = require('express');
const fineController = require('../controllers/fineController');
const router = Router();

router.get('/', fineController.renderViewFines);
router.get('/add', fineController.renderViewCreateFine);

module.exports = router;