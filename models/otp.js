const mongoose = require("mongoose");

// Records the OTP that is sent during the signup
// process.
const otpSchema = new mongoose.Schema({
  otp_code: {
    type: String,
    required: true,
  },
  otp_type: {
    type: String,
    enum: ["sms", "email"],
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activated_at: {
    type: Date,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
