const express = require("express");
const router = express.Router();
const { getTransactions } = require("../controllers/transactionController");
const auth = require("../middleware/authMiddleware"); // ensure user is logged in

router.get("/", auth, getTransactions);

module.exports = router;