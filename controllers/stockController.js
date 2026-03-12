const stockModel = require("../models/stockModel");

const getStocks = (req, res) => {
  stockModel.getAllStocks((err, stocks) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }

    res.json({
      success: true,
      data: stocks
    });
  });
};
module.exports = { getStocks };