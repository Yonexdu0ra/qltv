const { Router } = require('express');
const BorrowDetailController = require('../controllers/borrowDetailController');

const router = Router();
router.get('/search', BorrowDetailController.searchBorrowDetails);
router.get('/mark-as-returned/:id', BorrowDetailController.markAsReturned);

module.exports = router;