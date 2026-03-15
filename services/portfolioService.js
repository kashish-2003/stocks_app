const db = require("../config/db");


// UPDATE PORTFOLIO FROM STOCK TRANSACTIONS
exports.updatePortfolioFromTransactions = (user_id, callback) => {

  const query = `
    INSERT INTO portfolio (user_id, stock_id, symbol, quantity, avg_buy_price)
    SELECT
      st.user_id,
      st.stock_id,
      st.symbol,
      SUM(CASE WHEN st.type='BUY' THEN st.quantity ELSE -st.quantity END) AS quantity,
      ROUND(
        SUM(CASE WHEN st.type='BUY' THEN st.total_price ELSE 0 END) /
        NULLIF(SUM(CASE WHEN st.type='BUY' THEN st.quantity ELSE 0 END),0),
        2
      ) AS avg_buy_price
    FROM stock_transactions st
    WHERE st.user_id = ?
    GROUP BY st.stock_id, st.symbol
    HAVING quantity > 0
    ON DUPLICATE KEY UPDATE
      quantity = VALUES(quantity),
      avg_buy_price = VALUES(avg_buy_price)
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

};

// GET PORTFOLIO AFTER UPDATE
exports.getPortfolio = (user_id) => {
  return new Promise((resolve, reject) => {

    // first update portfolio
    exports.updatePortfolioFromTransactions(user_id, (err) => {
      if (err) return reject(err);

      const query = `
        SELECT 
          p.stock_id,
          p.symbol AS stock,
          p.quantity,
          p.avg_buy_price AS buy_price,
          s.price AS current_price,
          ROUND((s.price - p.avg_buy_price) * p.quantity, 2) AS profit_loss
        FROM portfolio p
        JOIN stocks s ON p.stock_id = s.id
        WHERE p.user_id = ?
        AND p.quantity > 0
      `;

      db.query(query, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });

    });

  });
};

exports.exitPosition = (user_id, portfolio_id) => {

  return new Promise((resolve, reject) => {

    const portfolioQuery = `
      SELECT stock_id, symbol, quantity
      FROM portfolio
      WHERE id = ? AND user_id = ?
    `;

    db.query(portfolioQuery, [portfolio_id, user_id], (err, rows) => {

      if (err) return reject(err);

      if (rows.length === 0) {
        return reject(new Error("Portfolio position not found"));
      }

      const stock_id = rows[0].stock_id;
      const symbol = rows[0].symbol;
      const quantity = rows[0].quantity;

      // current price
      const priceQuery = `
        SELECT price
        FROM stocks
        WHERE id = ?
      `;

      db.query(priceQuery, [stock_id], (err, priceRows) => {

        if (err) return reject(err);

        const price = priceRows[0].price;
        const totalPrice = price * quantity;

        // wallet add
        const walletQuery = `
          UPDATE wallet
          SET balance = balance + ?
          WHERE user_id = ?
        `;

        db.query(walletQuery, [totalPrice, user_id], (err) => {

          if (err) return reject(err);

          // SELL transaction
          const transactionQuery = `
            INSERT INTO stock_transactions
            (user_id, stock_id, symbol, quantity, total_price, type)
            VALUES (?, ?, ?, ?, ?, 'SELL')
          `;

          db.query(
            transactionQuery,
            [user_id, stock_id, symbol, quantity, totalPrice],
            (err) => {

              if (err) return reject(err);

              // portfolio delete
              const deleteQuery = `
                DELETE FROM portfolio
                WHERE id = ? AND user_id = ?
              `;

              db.query(deleteQuery, [portfolio_id, user_id], (err) => {

                if (err) return reject(err);

                resolve(true);

              });

            }
          );

        });

      });

    });

  });

};