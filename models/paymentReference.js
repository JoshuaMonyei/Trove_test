const { model, Schema } = require("mongoose");
const { customAlphabet } = require("nanoid");

// create shorter _id using nanoid package with a custom alphabet and size
// check https://github.com/ai/nanoid
const nanoid = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 12);

const paymentReferenceSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    // user making/initiating the payment
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: String,
    },
    // the id of the item being payed for i.e loan or credit
    loanId: {
      type: String,
      ref: "loan",
      required: true,
    },
    payment_link: {
      type: String,
    },
    currency: {
      type: String, default: "NGN",
    },
    // customer object sent to flutterwave
    customer: {
      type: Object,
    },
    // payment object that we get from flutterwave after verifying a payment is saved here
    payment_meta: {
      type: Object,
    },
    // url to send the user to after succesfull payment
    redirectUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "verification_failed", "verified"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("payment_reference", paymentReferenceSchema);
