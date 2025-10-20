const { Router} = require("express");
const authController = require("../../controllers/authController");
const router = Router();



router.post("/logout/:id", authController.handleLogout);

module.exports = router;