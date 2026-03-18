// 📡 WITHDRAW ROUTER ----------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { withdraw } = require("../controllers/withdrawController");
const auth = require("../middleware/authMiddleware");

//ROUTES...
router.post("/", auth, withdraw);

module.exports = router;