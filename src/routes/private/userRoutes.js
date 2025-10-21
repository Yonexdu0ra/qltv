const { Router} = require("express");
const userController = require("../../controllers/userController");

const router = Router();

router.get("/", userController.renderViewUsers);
router.get("/detail/:id", userController.renderViewDetailUser);
router.get("/edit/:id", userController.renderViewUpdateUser);
router.post("/edit/:id", userController.handleUpdateUser);
module.exports = router;