// 📡 PORTFOLIO ROUTER ----------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");


//ROUTES...
router.get("/getPortfolio", authMiddleware, portfolioController.getPortfolio);
router.post("/exit-position", authMiddleware, portfolioController.exitPosition);

module.exports = router;
