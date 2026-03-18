//=====================================================
// 📌CODE BY : DARSHIKA KHILLARE
//=====================================================

const db = require("../config/db");

// ============================================
// 📊 TRADE HISTORY
// ============================================

exports.getTradeHistory = (req, res) => {
  const userId = req.user.id;

  const sql = `
SELECT 
id,
user_id,
stock_id,
symbol,
quantity,
total_price,
type,
created_at
FROM stock_transactions
WHERE user_id = ?
ORDER BY created_at DESC
`;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "Trade history fetch error",
      });
    }

    res.json({
      success: true,
      data: result,
    });
  });
};
