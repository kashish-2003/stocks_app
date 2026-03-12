const db = require("../config/db");

exports.createWithdraw = async (
    user_id,
    cti_id,
    amount_usd
) => {

    const [wallet] = await db.query(

        "SELECT balance FROM wallet WHERE user_id = ?",
        [user_id]

    );

    if (wallet[0].balance < amount_usd) {

        throw new Error("Insufficient balance");

    }

    const [result] = await db.query(

        `INSERT INTO withdraw_requests 
        (user_id, cti_id, amount_usd)
        VALUES (?, ?, ?)`,
        [user_id, cti_id, amount_usd]

    );

    await db.query(

        `INSERT INTO transactions
        (user_id, sender_cti, receiver_cti, type, amount_usd, status)
        VALUES (?, 'admin@cti', ?, 'withdraw', ?, 'pending')`,

        [user_id, cti_id, amount_usd]

    );

    return result.insertId;
};