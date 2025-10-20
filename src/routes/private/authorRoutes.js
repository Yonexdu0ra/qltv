const { Router} = require("express");
const authController = require("../../controllers/authorController");


const router = Router();

router.get("/", authController.renderViewAuthor);  

router.get("/add", authController.renderViewCreateAuthor);
router.post("/add", authController.handleCreateAuthor);
router.get("/edit/:id", authController.renderViewUpdateAuthor);
router.post("/edit/:id", authController.handleUpdateAuthor);
router.get("/delete/:id", authController.renderViewDeleteAuthor);
router.post("/delete/:id", authController.handleDeleteAuthor);



module.exports = router;