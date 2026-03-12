// routes/depositRoute.js
const express = require("express");
const router = express.Router();

const { deposit } = require("../controllers/depositController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // multer setup

// Deposit API
router.post("/", auth, upload.single("screenshot"), deposit);

module.exports = router;