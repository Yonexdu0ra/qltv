const { Router } = require('express');
const BorrowDetailController = require('../controllers/borrowDetailController');

const router = Router();
router.get('/search', BorrowDetailController.searchBorrowDetails);

module.exports = router;