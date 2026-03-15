const portfolioService = require("../services/portfolioService");

exports.getPortfolio = async (req, res) => {
  try {
    const user_id = req.user.id; 

    const portfolio = await portfolioService.getPortfolio(user_id);

    res.json({
      success: true,
      portfolio
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.exitPosition = (req, res) => {

  const user_id = req.user.id;   
  const { portfolio_id } = req.body;

  portfolioService.exitPosition(user_id, portfolio_id)
    .then(result => {

      res.json({
        success: true,
        message: "Position exited successfully"
      });

    })
    .catch(err => {

      res.json({
        success: false,
        message: err.message
      });

    });

};