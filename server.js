require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 5000

// Routes
const stockRouter = require("./routes/stockRouter")
const authRoutes = require("./routes/authRoutes")
const depositRoutes = require("./routes/depositRoutes")
const withdrawRoutes = require("./routes/withdrawRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const walletRoutes = require("./routes/walletRoutes")
const adminRoutes = require("./routes/adminRoutes")

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Static folder
app.use("/uploads", express.static("uploads"))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/deposit", depositRoutes)
app.use("/api/withdraw", withdrawRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api", stockRouter)

// Server start
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})