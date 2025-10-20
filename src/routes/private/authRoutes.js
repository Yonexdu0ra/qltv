const { Router} = require("express");
const authController = require("../../controllers/authController");
const router = Router();


router.get("/change-password", authController.renderViewChangePassword);
router.post("/logout/:id", authController.handleLogout);

module.exports = router;