const db = require("../config/db");

exports.createDeposit = async (
    user_id,
    cti_id,
    amount_inr,
    leverage,
    screenshot
) => {

    const [result] = await db.query(

        `INSERT INTO deposits 
        (user_id, sender_cti, amount_inr, leverage, screenshot)
        VALUES (?, ?, ?, ?, ?)`,
        [user_id, cti_id, amount_inr, leverage, screenshot]

    );

    await db.query(

        `INSERT INTO transactions
        (user_id, sender_cti, receiver_cti, type, amount_inr, leverage, status)
        VALUES (?, ?, 'admin@cti', 'deposit', ?, ?, 'pending')`,

        [user_id, cti_id, amount_inr, leverage]

    );

    return result.insertId;
};