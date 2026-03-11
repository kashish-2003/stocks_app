const express = require("express");

const depositRoutes = require("./routes/depositRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(express.json());

app.use("/api", depositRoutes);
app.use("/api", withdrawRoutes);
app.use("/api", transactionRoutes);

app.listen(5000, () => {

    console.log("Server running on port 5000");

});