const router = require("express").Router();
const {
  generateUrl,
  getPaymentReference,
} = require("../controllers/paymentController");
const { isLoggedIn } = require("../middlewares/userAuth");

//  generate payment link
router.post("/payments", isLoggedIn, generateUrl);

// generate payment reference
router.get("/payments/reference/:txRef", getPaymentReference);

module.exports = router;
