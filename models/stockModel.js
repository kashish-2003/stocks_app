const db = require("../config/db");

// Get all stocks
const getAllStocks = (callback) => {
  const sql = "SELECT * FROM stocks";

  db.query(sql, (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, rows);
  });
};

// Create stock
const createStock = (symbol, company, price, exchange, callback) => {
  const sql = `
    INSERT INTO stocks (symbol, company_name, price, exchange)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [symbol, company, price, exchange], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Update stock price
const updateStockPrice = (symbol, price, callback) => {
  const sql = `
    UPDATE stocks
    SET price = ?
    WHERE symbol = ?
  `;

  db.query(sql, [price, symbol], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports = {
  getAllStocks,
  createStock,
  updateStockPrice
};