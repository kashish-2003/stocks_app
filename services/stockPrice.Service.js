//=====================================================
// 📌CODE BY : DARSHIKA KHILLARE
//=====================================================
const axios = require("axios");

const API_KEY = "d6knol9r01qmopd1eer0d6knol9r01qmopd1eerg";

const getStockPrice = async (symbol) => {
  try {

    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
    );

    return response.data.c; // current price

  } catch (error) {
    console.error("Stock API error:", error.message);
    return null;
  }
};
module.exports = { getStockPrice };