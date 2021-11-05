const { findUserById } = require("./findById");
const { sendSmsOtp, sendEmailOtp } = require("./sendActivationOtp");
const { verifyActivationOtp } = require("./verifyActivationOtp");
const {
  sendSmsPasswordResetToken,
  sendEmailPasswordResetToken,
} = require("./sendPasswordResetToken");

module.exports = {
  findUserById,
  verifyActivationOtp,
  sendSmsOtp,
  sendEmailOtp,
  sendSmsPasswordResetToken,
  sendEmailPasswordResetToken,
};
