const { Router} = require("express");
const authController = require("../../controllers/genreController");
const router = Router();

router.get("/", authController.renderViewGenresForReader);
router.get("/search", authController.handleSearchGenre);
router.get("/:slug", authController.renderViewDetailGenre);

module.exports = router;
