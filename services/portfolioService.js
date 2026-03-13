const db = require("../config/db");

exports.getPortfolio = (user_id) => {

  return new Promise((resolve, reject) => {

    const query = `
      SELECT 
        p.symbol AS stock,
        p.quantity,
        p.avg_buy_price AS buy_price,
        s.price AS current_price,

        ROUND(
          (s.price - p.avg_buy_price) * p.quantity,
          2
        ) AS profit_loss

      FROM portfolio p
      JOIN stocks s ON p.stock_id = s.id

      WHERE p.user_id = ?
      AND p.quantity > 0
    `;

    db.query(query, [user_id], (err, results) => {

      if (err) {
        return reject(err);
      }

      resolve(results);

    });

  });

};