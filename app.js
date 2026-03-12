require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
//const routes = require("./routes");
const updateStockPricesService = require("./services/updateStockPrices.Service");
const stockRouter = require("./routes/stockRouter");
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// app.use("/api", routes);
app.use("/api", stockRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});