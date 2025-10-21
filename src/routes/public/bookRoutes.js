const { Router } = require('express');
const BookController = require('../../controllers/bookController');
const router = Router();


router.get('/', BookController.renderViewBooksForReader);
router.get('/search', BookController.handleSearchBooks);
router.get('/:slug', BookController.renderViewDetailBook);

module.exports = router;