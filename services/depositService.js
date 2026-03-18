//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================

const db = require("../config/db"); 

exports.createDeposit = (user_id, cti_id, amount_inr, leverage, screenshotFileName, callback) => {

  if (!cti_id || cti_id.trim() === "") {
    return callback(new Error("CTI ID is required"));
  }

  const ctiRegex = /^[a-zA-Z0-9._-]+@cti$/;
  if (!ctiRegex.test(cti_id)) {
    return callback(new Error("Invalid CTI ID format. Only @cti allowed"));
  }

  if (!amount_inr || isNaN(amount_inr) || Number(amount_inr) <= 0) {
    return callback(new Error("Amount must be a positive number"));
  }

  const leverageRegex = /^1:\d+$/;
  if (!leverageRegex.test(leverage)) {
    return callback(new Error("Leverage format must be like 1:200"));
  }
  
  if (!screenshotFileName || screenshotFileName.trim() === "") {
    return callback(new Error("Screenshot image is required"));
  }

  // 1️⃣ Insert into deposits
  db.query(
    `INSERT INTO deposits (user_id, sender_cti, amount_inr, leverage, screenshot, status) 
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [user_id, cti_id, amount_inr, leverage, screenshotFileName],
    (err, depositResult) => {
      if (err) return callback(err);

      const depositId = depositResult.insertId;

      // 2️⃣ Insert into transactions
      db.query(
        `INSERT INTO transactions (user_id, sender_cti, receiver_cti, type, amount_inr, leverage, status)
         VALUES (?, ?, 'admin@cti', 'deposit', ?, ?, 'pending')`,
        [user_id, cti_id, amount_inr, leverage],
        (err2) => {
          if (err2) return callback(err2);

          callback(null, depositId);
        }
      );
    }
  );
};