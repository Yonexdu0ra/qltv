const { Router} = require("express");
const authController = require("../controllers/genreController");
const router = Router();

router.get("/", authController.renderViewGenre);
router.get("/add", authController.renderViewCreateGenre);
router.post("/create", authController.handleCreateGenre);
router.put("/edit/:id", authController.handleUpdateGenre);
router.get("/edit/:id", authController.renderViewUpdateGenre);
router.get("/delete/:id", authController.renderViewDeleteGenre);
router.delete("/delete/:id", authController.handleDeleteGenre);
router.get("/detail/:id", authController.renderViewDetailGenre);

module.exports = router;
