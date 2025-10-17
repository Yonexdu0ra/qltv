const { Router } = require("express");
const BorrowController = require("../controllers/borrowController");
const router = Router();


router.get("/", BorrowController.renderViewBorrows);
router.get("/add", BorrowController.renderViewCreateBorrow);
router.get("/detail/:id", BorrowController.renderViewBorrowDetail);
router.post("/add", BorrowController.handleCreateBorrow);

router.get('/mark-as-returned/:id', BorrowController.handlerMarkAsReturned);
router.get('/mark-as-rejected/:id', BorrowController.handlerMarkAsRejected);
router.get('/mark-as-approved/:id', BorrowController.handlerMarkAsApproved);
router.get('/mark-as-canceled/:id', BorrowController.handlerMarkAsCanceled);
router.get('/mark-as-borrowed/:id', BorrowController.handlerMarkAsBorrowed);
router.get('/mark-as-expired/:id', BorrowController.handlerMarkAsExpired);



module.exports = router