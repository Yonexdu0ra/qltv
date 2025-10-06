const { Router} = require("express");
const authController = require("../controllers/authorController");


const router = Router();

router.get("/", authController.renderViewAuthor);  

router.post("/create", authController.handleCreateAuthor);
router.put("/update/:id", authController.handleUpdateAuthor);
router.delete("/delete/:id", authController.handleDeleteAuthor);
router.get("/detail/:id", authController.renderViewDetailAuthor);



module.exports = router;