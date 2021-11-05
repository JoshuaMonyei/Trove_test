const Loan = require("../../models/loan");

exports.createloanService = async (body, userId) => {
  const {
    amount,
    period,
    interestRate,
    dueDate,
    description,
    currency,
  } = body;

  let totalAmount = amount;

  if (interestRate) {
    const interest = (Number(interestRate) * Number(amount)) / 100;
    totalAmount = Number(amount) + Number(interest);
  }

  const data = {
    amount,
    period,
    dueDate,
    totalAmount,
    interestRate,
    description,
    currency,
    userId,
  };

  const loan = await Loan.create(data);
  return loan;
};
