const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/stocks", stockController.getAllStocks);
router.post('/buy-stock', authMiddleware, stockController.buyStock);
router.get('/transactions/:user_id', stockController.transactionHistory);
router.post("/sell-stock", authMiddleware, stockController.sellStock);
module.exports = router;