const express = require("express");
const router = express.Router();

const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, walletController.getWallet);

module.exports = router;