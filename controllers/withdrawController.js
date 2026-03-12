const withdrawService = require("../services/withdrawService");

exports.withdraw = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { cti_id, amount_usd } = req.body;

        const result = await withdrawService.createWithdraw(
            user_id,
            cti_id,
            amount_usd
        );

        res.json({
            message: "Withdraw request created",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};