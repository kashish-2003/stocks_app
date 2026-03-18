//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================
const db = require("../config/db");

exports.createWithdraw = (user_id, cti_id, amount_usd, callback) => {

  if (!user_id) {
    return callback(new Error("User ID is required"));
  }

  if (!cti_id || cti_id.trim() === "") {
    return callback(new Error("CTI ID is required"));
  }

  const ctiRegex = /^[a-zA-Z0-9._-]+@cti$/;

  if (!ctiRegex.test(cti_id)) {
    return callback(new Error("Invalid CTI ID format. Only @cti allowed"));
  }

  if (!amount_usd || isNaN(amount_usd) || Number(amount_usd) <= 0) {
    return callback(new Error("Amount must be a positive number"));
  }

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