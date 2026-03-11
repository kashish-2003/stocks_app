const transactionService = require("../services/transactionService");

exports.getTransactions = async (req, res) => {

    try {

        const user_id = req.user.id;

        const transactions =
            await transactionService.getTransactions(user_id);

        res.json(transactions);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};