const { Schema, model } = require("mongoose");
const { customAlphabet } = require("nanoid");

// create shorter _id using nanoid package with a custom alphabet and size
// check https://github.com/ai/nanoid
const nanoid = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 12);

const loanSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    amount: { type: Number, required: true },
    period: { type: Number, enum: [6, 7, 8, 9, 10, 11, 12], required: true },
    totalAmount: { type: Number, required: true },
    totalAmountPaid: { type: Number, default: 0 },
    interestRate: { type: Number, required: true },
    dateIssued: { type: Date, default: Date.now },
    description: { type: String, default: "" },
    lastReminderRate: { type: Date, default: null },
    isPaid: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    currency: { type: String, default: "NGN" },
    isWrittenOff: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    transactions: [
      {
        ref: "transaction",
        type: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("loan", loanSchema);
