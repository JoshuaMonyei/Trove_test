const Otp = require("../../models/otp");
const generateOtp = require("../../utils/code_random");

exports.verifyActivationOtp = async (userId, otpCode) => {
  let isSuccessful;
  const otp = await Otp.findOne({
    userId,
    otpCode,
  });
  if (!otp) {
    isSuccessful = false;
    return isSuccessful;
  }
  const activated = await Otp.findOneAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: otp._id },
    { activated_at: Date.now(), otp_code: generateOtp(6, false) },
    { runValidators: true, new: true },
  );
  return activated;
};
