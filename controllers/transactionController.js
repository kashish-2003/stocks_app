//=====================================================
// 📌 CODE BY : PARAS VANVE
//=====================================================

//💰 TRANSACTION --------------------------------------------

const transactionService = require("../services/transactionService");

exports.getTransactions = (req, res) => {
  const user_id = req.user.id;
  const type = req.query.type; // deposit / withdraw / undefined

  transactionService.getTransactions(user_id, type, (err, transactions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json({
      success: true,
      data: transactions
    });
  });
};