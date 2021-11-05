/* eslint-disable no-underscore-dangle */
const axios = require("axios");
const PaymentReferenceModel = require("../../models/paymentReference");
const TransactionModel = require("../../models/transaction");
const LoanModel = require("../../models/loan");
const { getOneLoanService } = require("../loanServices");
const { ApiError } = require("../../utils/api_error");

exports.verifyFlutterwavePayment = async (txRef, transactionId) => {
  const paymentReference = await PaymentReferenceModel.findById(txRef);
  if (!paymentReference) {
    throw new ApiError("Payment reference not found", 404);
  }
  // verify the payment
  let verificationResponse;
  try {
    const { FLUTTERWARE_PRI } = process.env;
    const flutterWaveVerifyEndpoint = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
    const flutterwaveResponse = await axios.get(flutterWaveVerifyEndpoint, {
      headers: {
        Authorization: `Bearer ${FLUTTERWARE_PRI}`,
      },
    });

    // save the whole response from flutterwave incase someone wants to analyse it later
    paymentReference.payment_meta = flutterwaveResponse.data.data;
    paymentReference.status = "verified";
    verificationResponse = flutterwaveResponse.data.data;
    await paymentReference.save();
  } catch (error) {
    if (error.response.status === 400) {
      paymentReference.status = "verification_failed";
      await paymentReference.save();
      throw new ApiError("Invalid transaction id", 500);
    }
    throw new ApiError("Something went wrong while verifying the payment", 500);
  }
    const loan = await getOneLoanService(paymentReference.loanId);

    // update debt payment status
    const totalAmountPaid = loan.totalAmountPaid + verificationResponse.amount;

    const InflowTransaction = await TransactionModel.create({
        description: "Customer debt payment via flutterwave",
        currency: verificationResponse.currency,
        user_id: loan.userId,
        loan_id: loan._id,
        amount: paymentReference.amount,
      });

    // check if total amount paid equals total amount
    if (totalAmountPaid === loan.totalAmount) {
      await LoanModel.findOneAndUpdate(
        { _id: loan._id },
        {
          is_paid: true,
          totalAmountPaid,
          $push: { transactions: InflowTransaction._id },
        },
      );
    } else {
      await LoanModel.findOneAndUpdate(
        { _id: loan._id },
        {
          totalAmountPaid,
          $push: { transactions: InflowTransaction._id },
        },
      );
    }
};
