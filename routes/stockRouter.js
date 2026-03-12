const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/stocks", stockController.getStocks);

module.exports = router;