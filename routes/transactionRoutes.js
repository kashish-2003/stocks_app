const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const auth = require("../middlewares/authMiddleware");

router.get(
    "/transactions",
    auth,
    transactionController.getTransactions
);

module.exports = router;