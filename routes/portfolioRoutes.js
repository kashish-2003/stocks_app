const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getPortfolio", authMiddleware, portfolioController.getPortfolio);

module.exports = router;