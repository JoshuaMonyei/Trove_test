const PortfolioModel = require("../models/portofolio");
const LoanModel = require("../models/loan");
const {
  createLoanService,
  getOneloanService,
  loanExists,
} = require("../services/loanServices");

const { findUserById } = require("../services/userServices");
const { errorResponse, successResponse } = require("../utils/responseHandlers");

// user loan viability controller
exports.createloan = async (req, res, next) => {
  const {
 amount, interestRate, description, period, currency,
} = req.body;
  // add customer loan period to present date
  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + period);
  // get user portfolio value
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

  const maximumLoan = 0.6 * sum;
  if (amount >= maximumLoan) {
    return errorResponse(res, "Loan beyound User Limit", 403);
  }
  try {
    const body = {
      amount,
      interestRate,
      period,
      dueDate,
      description,
      currency,
    };
    const { user } = req;
    const loan = await createLoanService(body, user.id);
  } catch (err) {
    errorResponse(res, "Something went wrong", 500);
    return next(err);
  }
};

exports.checkBalance = async (req, res) => {
    try {
      const userId = req.user.id;
      const debtTotal = await LoanModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);
      const leftover = await LoanModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: { $subtract: ["$totalAmount", "$totalAmountPaid"] } },
          },
        },
      ]);

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

    const payload = {
      totalDebt: debtTotal,
      loanBalance: leftover,
      portfolioValue: sum,
    };
    // return user
    return successResponse(res, 200, payload);
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500);
  }
};
