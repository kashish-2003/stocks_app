const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/stocks", stockController.getAllStocks);
router.post('/buy-stock', stockController.buyStock);
router.get('/transactions/:user_id', stockController.transactionHistory);
router.post("/sell-stock", stockController.sellStock);
module.exports = router;