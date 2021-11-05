const Loan = require("../../models/loan");

exports.getOneloanService = async (id) => {
  const loan = await Loan.findOne({ _id: id });

  return loan;
};
