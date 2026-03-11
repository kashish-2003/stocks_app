const db = require("../config/db");

exports.getTransactions = async (user_id) => {

    const [rows] = await db.query(

        `SELECT * FROM transactions 
        WHERE user_id = ?
        ORDER BY created_at DESC`,

        [user_id]

    );

    return rows;
};