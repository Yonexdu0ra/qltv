const { Router} = require("express");
const authController = require("../../controllers/authController");
const router = Router();

router.get("/login", authController.renderViewLogin);

module.exports = router;