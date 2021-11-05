const router = require("express").Router();
const {
  generateUrl,
  getPaymentReference,
} = require("../controllers/paymentController");
const { isLoggedIn } = require("../middlewares/userAuth");

router.post("/payments", isLoggedIn, generateUrl);

router.get("/payments/reference/:txRef", getPaymentReference);

module.exports = router;
