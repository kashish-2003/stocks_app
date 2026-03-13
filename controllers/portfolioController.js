const portfolioService = require("../services/portfolioService");

exports.getPortfolio = async (req, res) => {

  try {

    const user_id = req.user.id;

    const portfolio = await portfolioService.getPortfolio(user_id);

    res.json({
      portfolio
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};