/* eslint-disable no-underscore-dangle */
const axios = require("axios");
const PaymentReferenceModel = require("../../models/paymentReference");
const { findUserById } = require("../userServices");
const { ApiError } = require("../../utils/api_error");

// function to generate flutterwave payment link and save payment reference
exports.generateFlutterwavePaymentUrl = async (paymentObj) => {
  const {
    amount,
    loanId,
    redirectUrl,
    user,
    currency,
  } = paymentObj;

  // customization object containing data to be displayed on the flutterwave payment modal
  const customizations = {
    title: "Trove Loan payment",
    description: "Investing Simplified",
    logo: "https://troveapp.co/favicon.ico",
  };
  // function to remove undefined,empty string and null values from an object
  // to be used with customer objects
  const removeUndefined = (obj) => {
    const newObj = Object.keys(obj).reduce((acc, key) => {
      const _acc = acc;
      if (obj[key] !== undefined || obj[key] !== "" || obj[key] !== null) {
        _acc[key] = obj[key];
      }
      return _acc;
    }, {});
    return newObj;
  };
  const requestingUser = await findUserById(user.id);
  const customer = {
    name: requestingUser.name,
    email: requestingUser.email,
    phoneNumber: requestingUser.phoneNumber,
  };
  // customer object to send to flutterwave when making a payment
  const customerObj = removeUndefined(customer);

  // create payment reference with all the data about the payment
  // so that we can use the data later when verifying the payment

  const paymentReference = await PaymentReferenceModel.create({
    user_id: user.id,
    amount,
    customer: customerObj,
    redirectUrl,
    loanId,
    status: "pending",
    currency,
  });
  const { FLUTTERWARE_PRI } = process.env;
  const { FLUTTERWAVE_REDIRECT_URL } = process.env;
  const flwLinkGenEndpoint = "https://api.flutterwave.com/v3/payments";
  const flwResponse = await axios.post(
    flwLinkGenEndpoint,
    {
      tx_ref: paymentReference._id,
      amount,
      currency,
      payment_options: "card",
      redirect_url: FLUTTERWAVE_REDIRECT_URL,
      customer: customerObj,
      customizations,
    },
    {
      headers: {
        Authorization: `Bearer ${FLUTTERWARE_PRI}`,
      },
    },
  );
  const { link } = flwResponse.data.data;
  paymentReference.payment_link = link;
  await paymentReference.save();
  return { link };
};
