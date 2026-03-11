const express = require("express");
const router = express.Router();

const withdrawController = require("../controllers/withdrawController");
const auth = require("../middlewares/authMiddleware");

router.post(
    "/withdraw",
    auth,
    withdrawController.withdraw
);

module.exports = router;