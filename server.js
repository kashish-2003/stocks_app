require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const stockRouter = require("./routes/stockRouter");
const authRoutes = require("./routes/authRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for screenshots
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/withdraw", withdrawRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", stockRouter);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});