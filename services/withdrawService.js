//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================
const db = require("../config/db");

exports.createWithdraw = (
  user_id,
  cti_id,
  amount_usd,
  callback
) => {

  // 1️⃣ Check wallet balance
  db.query(
    "SELECT balance FROM wallet WHERE user_id = ?",
    [user_id],
    (err, walletRows) => {

      if (err) return callback(err);

      if (walletRows.length === 0) {
        return callback(new Error("Wallet not found"));
      }

      if (walletRows[0].balance < amount_usd) {
        return callback(new Error("Insufficient balance"));
      }

      // 2️⃣ Create withdraw request
      db.query(
        `INSERT INTO withdraw_requests (user_id, cti_id, amount_usd, status)
         VALUES (?, ?, ?, 'pending')`,
        [user_id, cti_id, amount_usd],
        (err2, withdrawResult) => {

          if (err2) return callback(err2);

          const withdrawId = withdrawResult.insertId;

          // 3️⃣ Create transaction
          db.query(
            `INSERT INTO transactions 
            (user_id, sender_cti, receiver_cti, type, amount_usd, status)
            VALUES (?, 'admin@cti', ?, 'withdraw', ?, 'pending')`,
            [user_id, cti_id, amount_usd],
            (err3) => {

              if (err3) return callback(err3);

              callback(null, withdrawId);

            }
          );

        }
      );

    }
  );

};