const { Router} = require("express");
const authController = require("../../controllers/authorController");


const router = Router();

router.get("/", authController.renderViewAuthor);  

router.get("/:slug", authController.renderViewDetailAuthor);
router.get("/search", authController.handleSearchAuthor);



module.exports = router;