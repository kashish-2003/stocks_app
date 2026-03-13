const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/transactions?type=deposit / withdraw / empty
router.get("/", authMiddleware, transactionController.getTransactions);

module.exports = router;