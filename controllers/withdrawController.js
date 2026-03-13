const withdrawService = require("../services/withdrawService");

exports.withdraw = (req, res) => {

  const user_id = req.user.id;
  const { cti_id, amount_usd } = req.body;

  withdrawService.createWithdraw(
    user_id,
    cti_id,
    amount_usd,
    (err, withdrawId) => {

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        success: true,
        message: "Withdraw request created",
        withdrawId
      });

    }
  );

};