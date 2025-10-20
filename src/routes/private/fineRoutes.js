const { Router } = require('express');
const fineController = require('../../controllers/fineController');
const { requiredRoleLibrarianAndAdmin } = require("../../middleware/authorizationMiddleware");

const router = Router();

router.get('/', fineController.renderViewFines);
router.get('/add', fineController.renderViewCreateFine);
router.post('/add', fineController.handlerCreateFine);
router.get('/mark-as-paid/:id', requiredRoleLibrarianAndAdmin, fineController.handlerMarkAsPaidFine);

module.exports = router;