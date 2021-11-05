const { Schema, model } = require("mongoose");
const { customAlphabet } = require("nanoid");
// create shorter _id using nanoid package with a custom alphabet and size
// check https://github.com/ai/nanoid
const nanoid = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 12);

const transactionSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
      required: true,
    },
    amount: { type: Number, required: true },
    date_transacted: { type: Date, default: Date.now },
    description: { type: String, default: "" },
    loan_id: {
      type: String,
      required: true,
      ref: "loan",
    },
    currency: { type: String, default: "NGN" },
    user_id: { type: String, required: true, ref: "User" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = model("transaction", transactionSchema);
