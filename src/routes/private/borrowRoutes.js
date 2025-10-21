const { Router } = require("express");
const BorrowController = require("../../controllers/borrowController");
const { requiredRoleLibrarianAndAdmin } = require("../../middleware/authorizationMiddleware");

const router = Router();


router.get("/add", BorrowController.renderViewCreateBorrow);
router.post("/add", BorrowController.handleCreateBorrow);
router.get("/detail/:id", BorrowController.renderViewBorrowDetail);
router.get('/reader', BorrowController.renderViewBorrowsReader);
// cần quyền admin và thủ thư để truy cập
router.get("/", requiredRoleLibrarianAndAdmin, BorrowController.renderViewBorrows);
router.get('/mark-as-returned/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsReturned);
router.get('/mark-as-rejected/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsRejected);
router.get('/mark-as-approved/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsApproved);
router.get('/mark-as-canceled/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsCanceled);
router.get('/mark-as-borrowed/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsBorrowed);
router.get('/mark-as-expired/:id', requiredRoleLibrarianAndAdmin, BorrowController.handlerMarkAsExpired);



module.exports = router