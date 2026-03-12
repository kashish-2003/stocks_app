const db = require("../config/db")
const jwt = require("jsonwebtoken")

// ======================
// ADMIN LOGIN
// ======================

exports.adminLogin = (req,res)=>{

const {username,password} = req.body

const sql = "SELECT * FROM users WHERE username=? AND password=? AND role='admin'"

db.query(sql,[username,password],(err,result)=>{

if(err) return res.json({message:"DB error"})

if(result.length === 0){
return res.json({message:"Invalid admin credentials"})
}

const admin = result[0]

const token = jwt.sign(
{ id: admin.id, role: admin.role },
process.env.JWT_SECRET,
{ expiresIn: "1h" }
)

res.json({
message:"Admin login successful",
token
})

})

}


// ======================
// VIEW ALL USERS
// ======================

exports.getAllUsers = (req,res)=>{

db.query("SELECT * FROM users",(err,result)=>{

if(err) return res.json({message:"DB error"})

res.json(result)

})

}


// ======================
// VIEW ALL DEPOSITS
// ======================

exports.getAllDeposits = (req,res)=>{

db.query("SELECT * FROM deposits",(err,result)=>{

if(err) return res.json({message:"DB error"})

res.json(result)

})

}


// ======================
// APPROVE DEPOSIT
// ======================

exports.approveDeposit = (req,res)=>{

const {deposit_id} = req.body

const getDeposit = "SELECT * FROM deposits WHERE id=?"

db.query(getDeposit,[deposit_id],(err,result)=>{

if(err) return res.json({message:"DB error"})

if(result.length === 0){
return res.json({message:"Deposit not found"})
}

const deposit = result[0]

// already approved check
if(deposit.status === "approved"){
return res.json({message:"Deposit already approved"})
}

const userId = deposit.user_id
const inr = deposit.amount_inr

// INR → USD convert
const rate = 83
const usd = parseFloat((inr / rate).toFixed(2))


// update deposit table
const updateDeposit = `
UPDATE deposits 
SET status='approved', amount_usd=? 
WHERE id=?
`

db.query(updateDeposit,[usd,deposit_id],(err)=>{

if(err) return res.json({message:"Deposit update error"})


// check wallet
const checkWallet = "SELECT * FROM wallet WHERE user_id=?"

db.query(checkWallet,[userId],(err,walletResult)=>{

if(err) return res.json({message:"Wallet error"})


// create wallet if not exists
if(walletResult.length === 0){

const createWallet = "INSERT INTO wallet (user_id,balance) VALUES (?,?)"

db.query(createWallet,[userId,usd],(err)=>{

if(err) return res.json({message:"Wallet create error"})

res.json({message:"Deposit approved, wallet created"})
})

}
else{

// update wallet balance
const updateWallet = "UPDATE wallet SET balance = balance + ? WHERE user_id=?"

db.query(updateWallet,[usd,userId],(err)=>{

if(err) return res.json({message:"Wallet update error"})

res.json({message:"Deposit approved, wallet updated"})
})

}

})

})

})

}


// ======================
// REJECT DEPOSIT
// ======================

exports.rejectDeposit = (req,res)=>{

const {deposit_id} = req.body

const sql = "UPDATE deposits SET status='rejected' WHERE id=?"

db.query(sql,[deposit_id],(err)=>{

if(err) return res.json({message:"DB error"})

res.json({message:"Deposit rejected"})

})

}


// ======================
// GET WITHDRAW REQUESTS
// ======================

exports.getWithdrawRequests = (req,res)=>{

db.query("SELECT * FROM withdraw_requests",(err,result)=>{

if(err) return res.json({message:"DB error"})

res.json(result)

})

}


// ======================
// APPROVE WITHDRAW
// ======================

exports.approveWithdraw = (req,res)=>{

const {withdraw_id} = req.body

const getWithdraw = "SELECT * FROM withdraw_requests WHERE id=?"

db.query(getWithdraw,[withdraw_id],(err,result)=>{

if(err) return res.json({message:"DB error"})

if(result.length === 0){
return res.json({message:"Withdraw request not found"})
}

const withdraw = result[0]
const userId = withdraw.user_id
const amount = withdraw.amount_usd


// check wallet balance
const getWallet = "SELECT * FROM wallet WHERE user_id=?"

db.query(getWallet,[userId],(err,walletResult)=>{

if(err) return res.json({message:"Wallet error"})

if(walletResult.length === 0){
return res.json({message:"Wallet not found"})
}

const balance = walletResult[0].balance

if(balance < amount){
return res.json({message:"Insufficient wallet balance"})
}


// minus wallet balance
const updateWallet = "UPDATE wallet SET balance = balance - ? WHERE user_id=?"

db.query(updateWallet,[amount,userId],(err)=>{

if(err) return res.json({message:"Wallet update error"})


// update withdraw status
const updateWithdraw = "UPDATE withdraw_requests SET status='approved' WHERE id=?"

db.query(updateWithdraw,[withdraw_id],(err)=>{

if(err) return res.json({message:"Withdraw update error"})

res.json({message:"Withdraw approved & wallet balance deducted"})

})

})

})

})

}