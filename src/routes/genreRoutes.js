const { Router} = require("express");
const authController = require("../controllers/genreController");
const router = Router();

router.get("/", authController.renderViewGenre);
// router.get("/create", authController.renderViewCreateGenre);
router.post("/create", authController.handleCreateGenre);
router.put("/update/:id", authController.handleUpdateGenre);
router.delete("/delete/:id", authController.handleDeleteGenre);

module.exports = router;
