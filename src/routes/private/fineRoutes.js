const { Router } = require('express');
const fineController = require('../../controllers/fineController');
const { requiredRoleLibrarianAndAdmin } = require("../../middleware/authorizationMiddleware");

const router = Router();

router.get('/reader', fineController.renderViewFineForReader);
router.get('/', requiredRoleLibrarianAndAdmin, fineController.renderViewFines);
router.get('/detail/:id', requiredRoleLibrarianAndAdmin, fineController.renderViewFineDetail);
router.get('/add', requiredRoleLibrarianAndAdmin, fineController.renderViewCreateFine);
router.post('/add', requiredRoleLibrarianAndAdmin, fineController.handlerCreateFine);
router.get('/mark-as-paid/:id', requiredRoleLibrarianAndAdmin, fineController.handlerMarkAsPaidFine);

module.exports = router;