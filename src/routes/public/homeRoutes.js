const { Router } = require('express');

const HomeController = require('../../controllers/homeController');

const router = Router();
router.get('/', HomeController.renderViewHome);
router.get('/not-found', HomeController.renderViewNotFound);
router.get('/forbidden', HomeController.renderViewForbidden);
router.get('/contact', HomeController.renderViewContact);

module.exports = router