const { body } = require("express-validator");
const { findUserById } = require("../services/userServices");
const { getOneloanService } = require("../services/loanServices");
const {
  generateFlutterwavePaymentUrl,
  verifyFlutterwavePayment,
  currencyIsSupported,
  getSupportedCurrencies,
  findOnePaymentReference,
} = require("../services/paymentServices");
const { successResponse, errorResponse } = require("../utils/responseHandlers");
const { ApiError } = require("../utils/api_error");

exports.generateUrl = async (req, res, next) => {
  const {
    redirectUrl,
    amount,
    loanId,
    currency,
  } = req.body;

  try {
    // object containing all the data needed to create a payment reference
    const paymentObj = {
      amount,
      redirectUrl,
      loanId,
      user: req.user,
      currency,
    };
    const paymentLink = await generateFlutterwavePaymentUrl(paymentObj);
    return successResponse(res, 201, paymentLink);
  } catch (error) {
    if (error.code || error.code !== 500) {
      return errorResponse(res, error.message, error.code);
    }
    errorResponse(res, "Something went wrong", error.code);
    return next(error);
  }
};

exports.getPaymentReference = async (req, res, next) => {
  const { txRef } = req.params;
  try {
    const paymentReference = await findOnePaymentReference(txRef);
    if (!paymentReference) {
      return errorResponse(res, "Payment reference not found", 404);
    }
    return successResponse(res, 200, paymentReference);
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
    return next(error);
  }
};
