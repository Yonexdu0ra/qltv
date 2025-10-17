const { Router } = require('express');

const HomeController = require('../controllers/homeController');

const router = Router();
router.get('/', HomeController.renderViewHome);

module.exports = router