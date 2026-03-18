// 📡 WATCHLIST ROUTER ----------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const watchlistController = require("../controllers/watchlistController");
const auth = require("../middleware/authMiddleware");

//ROUTES...
router.post("/add", auth, watchlistController.addStock);
router.get("/get", auth, watchlistController.getWatchlist);
router.delete("/delete/:stock_id", auth, watchlistController.deleteWatchlist);

module.exports = router;