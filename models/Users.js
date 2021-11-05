const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      path: {
        type: String,
        default:
          "https://res.cloudinary.com/kyloren/image/upload/v1636059287/profilePicture_payxfk.webp",
      },
      filename: String,
    },
    emailToken: String,
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    dateOfBirth: Date,
    gender: String,
    employmentStatus: String,
    employer: String,
    jobRole: String,
    bank: String,
    accountNumber: Number,
    portfolios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio",
      },
    ],
    reset_password_token: {
      type: String,
      required: false,
    },
    reset_password_expires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
