const express = require("express")
const router = express.Router()

const {verifyToken,checkAdmin} = require("../middleware/adminAuth")

const {

adminLogin,
getAllUsers,
getAllDeposits,
approveDeposit,
rejectDeposit,
getWithdrawRequests,
approveWithdraw,
getAllWallets,
getAllKyc,
approveKyc

} = require("../controllers/adminController")

router.post("/login",adminLogin)

router.get("/users",verifyToken,checkAdmin,getAllUsers)

router.get("/deposits",verifyToken,checkAdmin,getAllDeposits)

router.post("/deposit/approve",verifyToken,checkAdmin,approveDeposit)

router.post("/deposit/reject",verifyToken,checkAdmin,rejectDeposit)

router.get("/withdraws",verifyToken,checkAdmin,getWithdrawRequests)

router.post("/withdraw/approve",verifyToken,checkAdmin,approveWithdraw)

router.get("/wallets",verifyToken,checkAdmin,getAllWallets)

router.get("/kyc",verifyToken,checkAdmin,getAllKyc)

router.post("/kyc/approve",verifyToken,checkAdmin,approveKyc)

module.exports = router