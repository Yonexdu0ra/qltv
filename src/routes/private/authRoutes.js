const { Router} = require("express");
const authController = require("../../controllers/authController");
const router = Router();


router.post("/login", authController.handleLogin);
router.post("/logout/:id", authController.handleLogout);

module.exports = router;