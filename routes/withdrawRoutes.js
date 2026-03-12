const express = require("express");
const router = express.Router();

const { withdraw } = require("../controllers/withdrawController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, withdraw);

module.exports = router;