const Loan = require("../../models/loan");

exports.loanExists = async (id) => {
  const loan = Loan.findOne({
    id,
  }).populate("user_id");

  return loan;
};
