const { Router } = require("express");
const authController = require("../../controllers/genreController");
const router = Router();

router.get("/", authController.renderViewGenre);
router.get("/add", authController.renderViewCreateGenre);
router.post("/add", authController.handleCreateGenre);
router.post("/edit/:id", authController.handleUpdateGenre);
router.get("/edit/:id", authController.renderViewUpdateGenre);
router.get("/delete/:id", authController.renderViewDeleteGenre);
router.post("/delete/:id", authController.handleDeleteGenre);

module.exports = router;

