//=====================================================
// 📌 CODE BY : PARAS VANVE
//=====================================================

// 💰 WALLET MANAGEMENT -------------------------------------------

const walletService = require("../services/walletService");

exports.getWallet = (req, res) => {

  const user_id = req.user.id;

  walletService.getWalletByUserId(user_id, (err, wallet) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json({
      success: true,
      data: wallet
    });

  });

};