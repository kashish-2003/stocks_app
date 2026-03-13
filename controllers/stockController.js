const stockModel = require("../models/stockModel");
//const transactionModel = require("../models/transactionModel");
// GET ALL STOCKS
const getAllStocks = (req, res) => {

  stockModel.getAllStocks((err, rows) => {

    if (err) {
      return res.json({
        success: false,
        message: "Error fetching stocks"
      });
    }

    res.json({
      success: true,
      data: rows
    });

  });

};



// BUY STOCK
const buyStock = (req, res) => {

  const { user_id, symbol, quantity, stock_id } = req.body;

  stockModel.getStockPrice(symbol, (err, stockRows) => {

    if (err || stockRows.length === 0) {
      return res.json({
        success: false,
        message: "Stock not found"
      });
    }

    const price = stockRows[0].price;
    const totalPrice = price * quantity;

    stockModel.getWalletBalance(user_id, (err, walletRows) => {

      if (err || walletRows.length === 0) {
        return res.json({
          success: false,
          message: "Wallet not found"
        });
      }

      const balance = walletRows[0].balance;

      if (balance < totalPrice) {
        return res.json({
          success: false,
          message: "Insufficient balance"
        });
      }

      stockModel.updateWalletBalance(totalPrice, user_id, (err) => {

        if (err) {
          return res.json({
            success: false,
            message: "Wallet deduction failed"
          });
        }

        stockModel.createTransaction(
          user_id,
          stock_id,
          symbol,
          quantity,
          totalPrice,
          (err, result) => {

            if (err) {
              return res.json({
                success: false,
                message: "Transaction failed"
              });
            }

            res.json({
              success: true,
              message: "Stock purchased successfully",
              transactionId: result.insertId
            });

          }
        );

      });
    });

  });

};

//SELL STOCK
// SELL STOCK
const sellStock = (req, res) => {

  const { user_id, symbol, quantity, stock_id } = req.body;

  // BASIC VALIDATION
  if (!user_id || !symbol || !quantity || !stock_id) {
    return res.json({
      success: false,
      message: "Missing required fields"
    });
  }

  if (quantity <= 0) {
    return res.json({
      success: false,
      message: "Quantity must be greater than 0"
    });
  }

  // CHECK STOCK EXISTS AND SYMBOL MATCH
  stockModel.getStockPrice(symbol, (err, stockRows) => {

    if (err || stockRows.length === 0) {
      return res.json({
        success: false,
        message: "Stock not found"
      });
    }

    const dbStockId = stockRows[0].id;
    const currentPrice = stockRows[0].price;

    if (dbStockId !== stock_id) {
      return res.json({
        success: false,
        message: "Stock ID does not match symbol"
      });
    }

    // CHECK USER STOCK HOLDINGS
    stockModel.getUserStockQuantity(user_id, symbol, (err, qtyRows) => {

      if (err) {
        return res.json({
          success: false,
          message: "Error checking holdings"
        });
      }

      const ownedQty = qtyRows[0].total_quantity || 0;

      if (ownedQty === 0) {
        return res.json({
          success: false,
          message: "No stocks owned"
        });
      }

      if (quantity > ownedQty) {
        return res.json({
          success: false,
          message: "Not enough stocks to sell"
        });
      }

      // GET TOTAL INVESTMENT
      stockModel.getTotalInvestment(user_id, symbol, (err, investRows) => {

        if (err) {
          return res.json({
            success: false,
            message: "Investment data error"
          });
        }

        const totalInvested = investRows[0].total_investment || 0;

        if (ownedQty === 0) {
          return res.json({
            success: false,
            message: "Invalid investment data"
          });
        }

        const avgBuyPrice = totalInvested / ownedQty;

        const sellValue = currentPrice * quantity;
        const buyValue = avgBuyPrice * quantity;

        const profitLoss = sellValue - buyValue;

        // ADD MONEY TO WALLET
        stockModel.addWalletBalance(sellValue, user_id, (err) => {

          if (err) {
            return res.json({
              success: false,
              message: "Wallet update failed"
            });
          }

          // INSERT SELL TRANSACTION
          stockModel.createSellTransaction(
            user_id,
            stock_id,
            symbol,
            -quantity,
            sellValue,
            (err, result) => {

              if (err) {
                return res.json({
                  success: false,
                  message: "Sell transaction failed"
                });
              }

              res.json({
                success: true,
                message: "Stock sold successfully",
                sell_price: currentPrice,
                total_sell_value: sellValue,
                profit_or_loss: profitLoss,
                transactionId: result.insertId
              });

            }
          );

        });

      });

    });

  });

};
// TRANSACTION HISTORY
const transactionHistory = (req, res) => {

  const user_id = req.params.user_id;

  stockModel.getTransactions(user_id, (err, rows) => {

    if (err) {
      return res.json({
        success: false,
        message: "Failed to fetch transactions"
      });
    }

    res.json({
      success: true,
      data: rows
    });

  });

};



module.exports = {
  getAllStocks,
  buyStock,
  sellStock,
  //getUserStockQuantity,
  // getTotalInvestment,
 //   addWalletBalance,
  transactionHistory
};