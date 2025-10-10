const { Router } = require('express');
const router = Router();
const BookController = require('../controllers/bookController');

router.get('/', BookController.renderViewBooks);

router.post('/add', BookController.handleCreateBook);
router.post('/edit/:id', BookController.handleEditBook);
router.post('/delete/:id', BookController.handleDeleteBook);

module.exports = router;