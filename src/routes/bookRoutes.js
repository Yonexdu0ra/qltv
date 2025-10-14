const { Router } = require('express');
const BookController = require('../controllers/bookController');
const multer = require('../config/multer');
const router = Router();

router.get('/', BookController.renderViewBooks);

router.get('/add', BookController.renderViewCreateBook);
router.post('/add', multer.single('image_cover'), BookController.handleCreateBook);
router.get('/edit/:id', BookController.renderViewEditBook);
router.post('/edit/:id', multer.single('image_cover'), BookController.handleEditBook);
router.get('/delete/:id', BookController.renderViewDeleteBook);
router.post('/delete/:id', BookController.handleDeleteBook);
router.get('/detail/:id', BookController.renderViewDetailBook);
router.get('/search', BookController.handleSearchBooks);

module.exports = router;