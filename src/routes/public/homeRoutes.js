const { Router } = require('express');

const HomeController = require('../../controllers/homeController');

const router = Router();
router.get('/', HomeController.renderViewHome);
router.get('/not-found', HomeController.renderViewNotFound);

module.exports = router