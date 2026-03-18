//=====================================================
// 📌CODE BY : PARAS VANVE
//=====================================================
const db = require("../config/db");

// single user wallet
exports.getWalletByUserId = (user_id, callback) => {

  const sql = "SELECT balance FROM wallet WHERE user_id = ?";

  db.query(sql, [user_id], (err, result) => {

    if (err) {
      return callback(err, null);
    }

    callback(null, result[0]);

  });

};


// ✅ ADMIN - ALL WALLETS
exports.getAllWallets = (callback) => {

  const sql = `
  SELECT 
  users.id,
  users.username,
  users.email,
  wallet.balance
  FROM wallet
  JOIN users ON wallet.user_id = users.id
  `

  db.query(sql,(err,result)=>{

    if(err){
      return callback(err,null)
    }

    callback(null,result)

  })

}