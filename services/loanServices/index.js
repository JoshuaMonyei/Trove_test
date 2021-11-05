const { createLoanService } = require("./createLoan");
const { getOneloanService } = require("./getLoan");
const { loanExists } = require("./loanExists");

module.exports = {
  createLoanService,
  getOneloanService,
  loanExists,
};
