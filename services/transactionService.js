const db = require("../config/db");

exports.getTransactions = (user_id, type, callback) => {
  let sql = "SELECT id, type, amount_inr AS amount, status, created_at FROM transactions WHERE user_id = ?";
  const params = [user_id];

  if (type === "deposit") {
    sql += " AND type = 'deposit'";
  } else if (type === "withdraw") {
    sql += " AND type = 'withdraw'";
  }

  db.query(sql, params, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};