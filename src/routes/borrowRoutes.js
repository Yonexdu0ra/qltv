const { Router } = require("express");
const BorrowController = require("../controllers/borrowController");
const router = Router();


router.get("/", BorrowController.renderViewBorrows);
router.get("/add", BorrowController.renderViewCreateBorrow);

module.exports = router