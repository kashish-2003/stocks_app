//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================

//DEPOSITE CONTROLLER

const depositService = require("../services/depositService");

exports.deposit = (req, res) => {
  const user_id = req.user.id;
  const { cti_id, amount_inr, leverage } = req.body;
  const screenshotFileName = req.file ? req.file.filename : null;

  depositService.createDeposit(
    user_id,
    cti_id,
    amount_inr,
    leverage,
    screenshotFileName,
    (err, depositId) => {
      if (err) {
        console.error("Deposit Error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
      }
      res
        .status(200)
        .json({ success: true, message: "Deposit request created", depositId });
    },
  );
};
