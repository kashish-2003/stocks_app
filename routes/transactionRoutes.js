// 📡 TTRANSCATION ROUTER ----------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

//ROUTES...
router.get("/", authMiddleware, transactionController.getTransactions);

module.exports = router;
