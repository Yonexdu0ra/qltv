const { Router} = require("express");
const authController = require("../../controllers/genreController");
const router = Router();


router.get("/:slug", authController.renderViewDetailGenre);
router.get("/search", authController.handleSearchGenre)

module.exports = router;
