const express = require("express")
const router = express.Router()

const { signup, login, forgetPassword, changePassword } = require("../controllers/authController")

// Routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/forget-password", forgetPassword)
router.post("/change-password", changePassword)

module.exports = router