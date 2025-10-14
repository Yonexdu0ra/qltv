const { Router} = require("express");
const authController = require("../controllers/authController");
const router = Router();

router.get("/login", authController.renderViewLogin);
router.post("/login", authController.handleLogin);
router.post("/logout/:id", authController.handleLogout);

module.exports = router;
