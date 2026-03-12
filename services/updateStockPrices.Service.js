const cron = require("node-cron");
const db = require("../config/db");
const { getStockPrice } = require("./stockPrice.Service");
const { updateStockPrice } = require("../models/stockModel");

const updateAllPrices = () => {

  db.query("SELECT symbol FROM stocks", async (err, stocks) => {

    if (err) {
      console.log("Error fetching stocks:", err);
      return;
    }

    for (const stock of stocks) {

      try {

        const price = await getStockPrice(stock.symbol);

        if (price) {

          updateStockPrice(stock.symbol, price, (err) => {

            if (err) {
              console.log("Update error:", err);
            } else {
              console.log(`${stock.symbol} updated → ${price}`);
            }

          });

        }

      } catch (error) {
        console.log("Price fetch error:", error);
      }

    }

  });

};

cron.schedule("*/60 * * * * *", () => {
  console.log("Updating stock prices...");
  updateAllPrices();
});

module.exports = { updateAllPrices };