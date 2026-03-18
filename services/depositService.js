//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================

const db = require("../config/db"); 

exports.createDeposit = (user_id, cti_id, amount_inr, leverage, screenshotFileName, callback) => {
  // 1️⃣ Insert into deposits
  db.query(
    `INSERT INTO deposits (user_id, sender_cti, amount_inr, leverage, screenshot, status) 
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [user_id, cti_id, amount_inr, leverage, screenshotFileName],
    (err, depositResult) => {
      if (err) return callback(err);

      const depositId = depositResult.insertId;

      // 2️⃣ Insert into transactions (also pending)
      db.query(
        `INSERT INTO transactions (user_id, sender_cti, receiver_cti, type, amount_inr, leverage, status)
         VALUES (?, ?, 'admin@cti', 'deposit', ?, ?, 'pending')`,
        [user_id, cti_id, amount_inr, leverage],
        (err2) => {
          if (err2) return callback(err2);

          // ✅ Wallet update is NOT done here, will happen after admin approves
          callback(null, depositId);
        }
      );
    }
  );
};