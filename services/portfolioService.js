const db = require("../config/db");

exports.getPortfolio = (user_id) => {

  return new Promise((resolve, reject) => {

    const query = `
    SELECT 
      st.symbol AS stock,

      SUM(CASE WHEN st.type='BUY' THEN st.quantity ELSE -st.quantity END) AS quantity,

      ROUND(
        SUM(CASE WHEN st.type='BUY' THEN st.total_price ELSE 0 END) /
        SUM(CASE WHEN st.type='BUY' THEN st.quantity ELSE 0 END), 2
      ) AS buy_price,

      s.price AS current_price,

      ROUND(
        (s.price *
        SUM(CASE WHEN st.type='BUY' THEN st.quantity ELSE -st.quantity END))
        -
        SUM(CASE WHEN st.type='BUY' THEN st.total_price ELSE 0 END),
        2
      ) AS profit_loss

    FROM stock_transactions st
    JOIN stocks s ON st.stock_id = s.id

    WHERE st.user_id = ?

    GROUP BY st.stock_id, st.symbol, s.price

    HAVING quantity > 0
    `;

    db.query(query, [user_id], (err, results) => {

      if (err) {
        return reject(err);
      }

      resolve(results);

    });

  });

};