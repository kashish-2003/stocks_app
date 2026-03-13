const db = require('../config/db');


// UPDATE STOCK PRICE
const updateStockPrice = (symbol, price, callback) => {

  const sql = `
    UPDATE stocks
    SET price = ?
    WHERE symbol = ?
  `;

  db.query(sql, [price, symbol], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });

};


// GET ALL STOCKS
const getAllStocks = (callback) => {

  const sql = "SELECT * FROM stocks";

  db.query(sql, (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });

};


// GET STOCK PRICE
const getStockPrice = (symbol, callback) => {

  const sql = "SELECT id, price FROM stocks WHERE symbol = ?";

  db.query(sql, [symbol], (err, rows) => {

    if (err) {
      return callback(err, null);
    }

    callback(null, rows);
  });
};

// GET WALLET BALANCE
const getWalletBalance = (user_id, callback) => {

  const sql = "SELECT balance FROM wallet WHERE user_id = ?";

  db.query(sql, [user_id], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });

};


// UPDATE WALLET (FOR BUY)
const updateWalletBalance = (amount, user_id, callback) => {

  const sql = "UPDATE wallet SET balance = balance - ? WHERE user_id = ?";

  db.query(sql, [amount, user_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });

};


// ADD WALLET BALANCE (FOR SELL)
const addWalletBalance = (amount, user_id, callback) => {

  const sql = `
    UPDATE wallet
    SET balance = balance + ?
    WHERE user_id = ?
  `;

  db.query(sql, [amount, user_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });

};




// CREATE BUY TRANSACTION
const createTransaction = (user_id, stock_id, symbol, quantity, total_price, callback) => {

  const sql = `
    INSERT INTO stock_transactions
    (user_id, stock_id, symbol, quantity, total_price, type)
    VALUES (?, ?, ?, ?, ?, 'BUY')
  `;

  db.query(sql, [user_id, stock_id, symbol, quantity, total_price], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });

};


// CREATE SELL TRANSACTION
const createSellTransaction = (user_id, stock_id, symbol, quantity, total_price, callback) => {

  const sql = `
    INSERT INTO stock_transactions
    (user_id, stock_id, symbol, quantity, total_price, type)
    VALUES (?, ?, ?, ?, ?, 'SELL')
  `;

  db.query(sql, [user_id, stock_id, symbol, quantity, total_price], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });

};


// GET USER STOCK QUANTITY (BUY - SELL)
const getUserStockQuantity = (user_id, symbol, callback) => {

  const sql = `
    SELECT 
      SUM(CASE WHEN type='BUY' THEN quantity ELSE 0 END) -
      SUM(CASE WHEN type='SELL' THEN quantity ELSE 0 END)
      AS total_quantity
    FROM stock_transactions
    WHERE user_id = ? AND symbol = ?
  `;

  db.query(sql, [user_id, symbol], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });

};


// GET TOTAL INVESTMENT (ONLY BUY)
const getTotalInvestment = (user_id, symbol, callback) => {

  const sql = `
    SELECT SUM(total_price) AS total_investment
    FROM stock_transactions
    WHERE user_id = ? AND symbol = ? AND type='BUY'
  `;

  db.query(sql, [user_id, symbol], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });

};


// TRANSACTION HISTORY
const getTransactions = (user_id, callback) => {

  const sql = `
    SELECT 
      t.id,
      t.symbol,
      t.quantity,
      t.total_price,
      t.type,
      t.created_at
    FROM stock_transactions t
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });

};


// EXPORT FUNCTIONS
module.exports = {
  updateStockPrice,
  getAllStocks,
  getStockPrice,
  getWalletBalance,
  updateWalletBalance,
  createTransaction,
  createSellTransaction,
  getTransactions,
  getUserStockQuantity,
  getTotalInvestment,
  addWalletBalance
};