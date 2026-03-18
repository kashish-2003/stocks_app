//=====================================================
// 📌 CODE BY : PARAS VANVE
//=====================================================

// ⭐ WATHCLIST MANAGEMENT -------------------------------------------

const watchlistService = require("../services/watchlistService");

// ➕ Add Stock to Watchlist
exports.addStock = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { stock_id } = req.body;

    await watchlistService.addToWatchlist(user_id, stock_id);

    res.json({
      message: "Stock added to watchlist",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// 👀 View Watchlist Stocks
exports.getWatchlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    const data = await watchlistService.getWatchlist(user_id);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
// ❌ Remove Stock from Watchlist
exports.deleteWatchlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { stock_id } = req.params;

    await watchlistService.deleteWatchlist(user_id, stock_id);

    res.json({
      message: "Stock removed from watchlist",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
