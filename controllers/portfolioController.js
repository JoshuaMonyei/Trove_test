const PortfolioModel = require("../models/portofolio");
const UserModel = require("../models/Users");
const { successResponse, errorResponse } = require("../utils/responseHandlers");

exports.createPortfolio = async (req, res) => {
  try {
    const { symbol, totalQuantity, pricePerShare } = req.body;
    const equityValue = totalQuantity * pricePerShare;
    const portfolio = await PortfolioModel.create({
      symbol,
      totalQuantity,
      equityValue,
      pricePerShare,
      user_id: req.user.id,
    });
    UserModel.findOne({ id: req.user }, (err, user) => {
      // Add new created portfolio to the user portfolio array field
      user.portfolios.push(portfolio);
      user.save();
    });
    return successResponse(res, 201, portfolio);
  } catch (error) {
    return errorResponse(res, "Portfolio couldn't be created", 400);
  }
};

exports.getPortfolioPosition = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.find(
      { user_id: { $eq: req.user.id } },
      "symbol totalQuantity equityValue pricePerShare",
    );
    // return user
    return successResponse(res, 200, portfolio);
  } catch (error) {
    return errorResponse(res, "Couldn't fetch user portfolio", 500);
  }
};

exports.getPortfolioValue = async (req, res) => {
  try {
    const portfolio = await PortfolioModel.find(
      { user_id: { $eq: req.user.id } },
      "symbol totalQuantity equityValue pricePerShare",
    );
    // eslint-disable-next-line prefer-const
    let initialValue = 0;
  const sum = portfolio.reduce(
    (previousValue, currentValue) => previousValue + currentValue.equityValue,
    initialValue,
  );
    // return user
    return successResponse(res, 200, sum);
  } catch (error) {
    return errorResponse(res, "Couldn't fetch user portfolio", 500);
  }
};
