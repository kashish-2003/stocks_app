const db = require("../config/db");

exports.addToWatchlist = (user_id, stock_id) => {
    return new Promise((resolve, reject) => {

        const query = "INSERT INTO watchlist (user_id, stock_id) VALUES (?, ?)";

        db.query(query, [user_id, stock_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });

    });
};



exports.getWatchlist = (user_id) => {
    return new Promise((resolve, reject) => {

        const query = `
SELECT 
    w.id AS watchlist_id,
    w.user_id,
    w.stock_id,
    s.company_name,
    s.symbol,
    s.price
FROM watchlist w
JOIN stocks s ON w.stock_id = s.id
WHERE w.user_id = ?
`;

        db.query(query, [user_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });

    });
};

exports.deleteWatchlist = (user_id, stock_id) => {

    return new Promise((resolve, reject) => {

        const query = "DELETE FROM watchlist WHERE user_id = ? AND stock_id = ?";

        db.query(query, [user_id, stock_id], (err, result) => {

            if (err) return reject(err);

            resolve(result);

        });

    });

};