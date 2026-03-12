const transactionService = require("../services/transactionService");

exports.getTransactions = (req, res) => {
  const user_id = req.user.id; // auth middleware se milega

  transactionService.getTransactions(user_id, (err, transactions) => {
    if (err) {
      console.error("Transaction Controller Error:", err);
      return res.status(500).json({ error: err.message });
    }

    res.status(200).json({
      success: true,
      transactions
    });
  });
};