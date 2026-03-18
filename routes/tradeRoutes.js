// 📡 TRADE HISTORY ROUTER ----------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/adminAuth");
const { getTradeHistory } = require("../controllers/tradeController");

//ROUTES...
router.get("/history", verifyToken, getTradeHistory);

module.exports = router;
