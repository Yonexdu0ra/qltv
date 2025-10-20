const { Router} = require("express");
const authController = require("../../controllers/authorController");

const router = Router();

router.get("/search", authController.handleSearchAuthors);
router.get("/:slug", authController.renderViewDetailAuthor);



module.exports = router;