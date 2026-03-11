const express = require("express");
const router = express.Router();

const depositController = require("../controllers/depositController");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
    "/deposit",
    auth,
    upload.single("screenshot"),
    depositController.deposit
);

module.exports = router;