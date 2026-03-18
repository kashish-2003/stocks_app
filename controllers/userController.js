//=====================================================
// 📌 CODE BY : KASHISH RITHE
//=====================================================

const db = require("../config/db");

// ============================================
// 📩 KYC SUBMISSION
// ============================================

exports.submitKyc = (req, res) => {
  const userId = req.user.id;

  const aadhaar = req.files["aadhaar_image"][0].filename;
  const selfie = req.files["selfie_image"][0].filename;

  const sql = `
        INSERT INTO kyc (user_id,aadhaar_image,selfie_image,kyc_status)
        VALUES (?,?,?,'done')
`;

  db.query(sql, [userId, aadhaar, selfie], (err) => {
    if (err) {
      return res.json({ message: "KYC submit error" });
    }

    res.json({
      message: "KYC done successfully",
    });
  });
};

// ============================================
// 🔔 CREATE WITHDRAW REQUEST
// ============================================

exports.createWithdrawRequest = (req, res) => {
  const userId = req.user.id;
  const { amount_usd } = req.body;

  // 🔎 STEP 1 → CHECK KYC
  const checkKyc = "SELECT * FROM kyc WHERE user_id=?";

  db.query(checkKyc, [userId], (err, kycResult) => {
    if (err) {
      return res.json({ message: "KYC check error" });
    }

    // ❌ IF NO KYC
    if (kycResult.length === 0) {
      return res.json({
        message: "Do KYC first before withdraw",
      });
    }

    // 🔎 STEP 2 → CHECK WALLET
    const getWallet = "SELECT * FROM wallet WHERE user_id=?";

    db.query(getWallet, [userId], (err, walletResult) => {
      if (walletResult.length === 0) {
        return res.json({ message: "Wallet not found" });
      }

      const balance = walletResult[0].balance;

      if (balance < amount_usd) {
        return res.json({ message: "Insufficient balance" });
      }

      // 🔎 STEP 3 → CREATE WITHDRAW REQUEST
      const sql = `
        INSERT INTO withdraw_requests (user_id,amount_usd,status)
        VALUES (?,?,'pending')
`;

      db.query(sql, [userId, amount_usd], (err) => {
        if (err) {
          return res.json({ message: "Withdraw request error" });
        }

        res.json({
          message: "Withdraw request sent to admin",
        });
      });
    });
  });
};
