const { Router } = require('express');
const fineController = require('../../controllers/fineController');
const { requiredRoleLibrarianAndAdmin } = require("../../middleware/authorizationMiddleware");

const router = Router();

router.get('/detail/:id', fineController.renderViewFineDetail);
router.get('/reader', fineController.renderViewFineForReader);
router.get('/', requiredRoleLibrarianAndAdmin, fineController.renderViewFines);
router.get('/add', requiredRoleLibrarianAndAdmin, fineController.renderViewCreateFine);
router.get('/edit/:id', requiredRoleLibrarianAndAdmin, fineController.renderViewEditFine);
router.post('/edit/:id', requiredRoleLibrarianAndAdmin, fineController.handlerEditFine);
router.post('/add', requiredRoleLibrarianAndAdmin, fineController.handlerCreateFine);
router.get('/mark-as-paid/:id', requiredRoleLibrarianAndAdmin, fineController.handlerMarkAsPaidFine);

module.exports = router;