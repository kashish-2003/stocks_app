require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const stockRouter = require("./routes/stockRouter")
const authRoutes = require("./routes/authRoutes")
const depositRoutes = require("./routes/depositRoutes")
const withdrawRoutes = require("./routes/withdrawRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const adminRoutes = require("./routes/adminRoutes")   // ✅ ADD THIS

const stockRouter = require("./routes/stockRouter");
const authRoutes = require("./routes/authRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const walletRoutes = require("./routes/walletRoutes");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRoutes)
app.use("/api/deposit", depositRoutes)
app.use("/api/withdraw", withdrawRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/admin", adminRoutes)   // ✅ ADD THIS
app.use("/api", stockRouter)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api", stockRouter);

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})