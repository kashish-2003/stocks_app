//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================
const db = require("../config/db");

exports.addToWatchlist = (user_id, stock_id) => {
  return new Promise((resolve, reject) => {

    
    if (!stock_id || isNaN(stock_id)) {
      return reject(new Error("Valid stock ID is required"));
    }

    // check stock exists
    const checkStock = "SELECT id FROM stocks WHERE id = ?";

    db.query(checkStock, [stock_id], (err, stockRows) => {

      if (err) return reject(err);

      if (stockRows.length === 0) {
        return reject(new Error("Stock not found"));
      }

      // check duplicate
      const checkWatchlist =
        "SELECT id FROM watchlist WHERE user_id = ? AND stock_id = ?";

      db.query(checkWatchlist, [user_id, stock_id], (err2, rows) => {

        if (err2) return reject(err2);

        if (rows.length > 0) {
          return reject(new Error("Stock already in watchlist"));
        }

        const query =
          "INSERT INTO watchlist (user_id, stock_id) VALUES (?, ?)";

        db.query(query, [user_id, stock_id], (err3, result) => {

          if (err3) return reject(err3);

          resolve(result);

        });

      });

    });

  });
};



exports.getWatchlist = (user_id) => {
  return new Promise((resolve, reject) => {

    const query = `
SELECT 
    w.id AS watchlist_id,
    w.stock_id,
    s.company_name,
    s.symbol,
    s.price
FROM watchlist w
JOIN stocks s ON w.stock_id = s.id
WHERE w.user_id = ?
`;

    db.query(query, [user_id], (err, result) => {

      if (err) return reject(err);

      resolve(result);

    });

  });
};

exports.deleteWatchlist = (user_id, stock_id) => {

  return new Promise((resolve, reject) => {

    if (!stock_id || isNaN(stock_id)) {
      return reject(new Error("Valid stock ID is required"));
    }

    const query =
      "DELETE FROM watchlist WHERE user_id = ? AND stock_id = ?";

    db.query(query, [user_id, stock_id], (err, result) => {

      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject(new Error("Stock not found in watchlist"));
      }

      resolve(result);

    });

  });

};