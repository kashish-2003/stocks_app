const depositService = require("../services/depositService");

exports.deposit = async (req, res) => {

    try {

        const user_id = req.user.id;
        const { cti_id, amount_inr, leverage } = req.body;
        const screenshot = req.file ? req.file.filename : null;

        const result = await depositService.createDeposit(
            user_id,
            cti_id,
            amount_inr,
            leverage,
            screenshot
        );

        res.json({
            message: "Deposit request created",
            data: result
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};