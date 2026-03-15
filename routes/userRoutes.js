const express = require("express")
const router = express.Router()

const upload = require("../middleware/uploadKyc")
const {verifyToken} = require("../middleware/adminAuth")

const {
submitKyc,
createWithdrawRequest
} = require("../controllers/userController")

// ======================
// USER KYC SUBMIT
// ======================

router.post(
"/kyc-submit",
verifyToken,
upload.fields([
{name:"aadhaar_image"},
{name:"selfie_image"}
]),
submitKyc
)


// ======================
// USER WITHDRAW REQUEST
// ======================

router.post(
"/withdraw",
verifyToken,
createWithdrawRequest
)

module.exports = router