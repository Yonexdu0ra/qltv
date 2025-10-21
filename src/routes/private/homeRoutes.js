const { Router } = require('express');

const HomeController = require('../../controllers/homeController');

const router = Router();

router.get('/', HomeController.renderViewDashboard);

module.exports = router