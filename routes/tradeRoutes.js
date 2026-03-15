const express = require("express")
const router = express.Router()

const {verifyToken} = require("../middleware/adminAuth")

const {getTradeHistory} = require("../controllers/tradeController")

// TRADE HISTORY API
router.get("/history",verifyToken,getTradeHistory)

module.exports = router