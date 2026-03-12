const db = require("../config/db"); // normal mysql2

exports.getTransactions = (user_id, callback) => {
  db.query(
    `SELECT * FROM transactions 
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [user_id],
    (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    }
  );
};