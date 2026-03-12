const db = require("../config/db");

exports.getWalletByUserId = (user_id, callback) => {

  const sql = "SELECT balance FROM wallet WHERE user_id = ?";

  db.query(sql, [user_id], (err, result) => {

    if (err) {
      return callback(err, null);
    }

    callback(null, result[0]);

  });

};