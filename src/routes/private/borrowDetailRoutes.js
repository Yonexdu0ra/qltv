const { Router } = require('express');
const BorrowDetailController = require('../../controllers/borrowDetailController');
const { requiredRoleLibrarianAndAdmin } = require("../../middleware/authorizationMiddleware");

const router = Router();
router.get('/search', BorrowDetailController.handleSearchBorrowDetailBooks);
router.get('/mark-as-returned/:id', requiredRoleLibrarianAndAdmin, BorrowDetailController.markAsReturned);

module.exports = router;