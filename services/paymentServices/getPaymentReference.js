const PaymentReferenceModel = require("../../models/paymentReference");

exports.findOnePaymentReference = async (txRef) => {
  const paymentReference = await PaymentReferenceModel.findOne({ _id: txRef });
  return paymentReference;
};
