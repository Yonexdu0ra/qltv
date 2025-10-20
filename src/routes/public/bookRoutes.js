const { Router } = require('express');
const BookController = require('../../controllers/bookController');
const router = Router();


router.get('/detail/:id', BookController.renderViewDetailBook);
router.get('/search', BookController.handleSearchBooks);

module.exports = router;