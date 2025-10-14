const { Router} = require("express");
const accountController = require("../controllers/accountController");


const router = Router();

router.get("/", accountController.renderViewAccounts);  
router.get("/add", accountController.renderViewCreateAccount);  
router.post("/add", accountController.handleCreateAccount);  
router.get("/reissue-password/:id", accountController.renderViewReissuePassword);
router.post("/reissue-password/:id", accountController.handleReissuePassword);





module.exports = router;