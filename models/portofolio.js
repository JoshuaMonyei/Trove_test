const mongoose = require("mongoose");

// user schema
const PortfolioSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    equityValue: Number,
    pricePerShare: {
      type: Number,
      required: true,
    },
    // user that own the portfolio
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Portfolio", PortfolioSchema);
